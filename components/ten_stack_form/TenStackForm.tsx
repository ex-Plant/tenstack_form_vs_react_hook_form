'use client';

import { Button } from '@/components/ui/button';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@/components/ui/field';
import { SelectItem } from '@/components/ui/select';
import React from 'react';
import { z } from 'zod';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { useAppForm } from '@/components/ten_stack_form/tenStackFormHooks';
import { useStore } from '@tanstack/react-form';
import { XIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';

type SelectOption = {
	value: string;
	label: string;
};

export const PROJECT_STAGES: SelectOption[] = [
	{ value: 'concept', label: 'koncepcja' },
	{ value: 'project', label: 'projekt wykonawczy' },
	{ value: 'realization', label: 'realizacja' },
];

export const cartSchema = z.object({
	company_name: z.string().min(1),
	email: z.string().min(3, { message: 'Podaj prawidłowy adres email' }),
	nip: z.string().length(10, { message: 'Nieprawidłowy numer NIP' }),
	project_stage: z.string().min(1),

	// consents must be true
	consents: z.object({
		consent1: z.boolean().refine((val) => val === true),
		consent2: z.boolean().refine((val) => val === true),
	}),
	users: z
		.array(
			z.object({
				email: z.email(),
			})
		)
		.min(1)
		.max(5),
});

export type CartSchemaT = z.infer<typeof cartSchema>;

export default function TenStackFormAdvanced() {
	const form = useAppForm({
		defaultValues: {
			company_name: '',
			email: '',
			nip: '',
			project_stage: '',
			consents: {
				consent1: false,
				consent2: false,
			},
			users: [],
		} satisfies CartSchemaT as CartSchemaT,
		validators: {
			onSubmit: cartSchema,
		},
		onSubmit: async (data) => {
			console.log('🚀 formData: ', data.value);
			alert('✅');
			// prevent resetting form
			return false;
		},
	});

	const isSubmitting = useStore(form.store, (s) => s.isSubmitting);
	const isFormValid = useStore(
		form.store,
		(state) => !state.isValidating && Object.keys(state.errors || {}).length === 0
	);
	const errors = useStore(form.store, (state) => state).errors;

	console.log('isSubmitting:', isSubmitting);
	console.log('isValid: ', isFormValid);
	console.log('❌ errors: ', errors);

	// Get all errors

	return (
		<div className='container mx-auto my-6 px-4'>
			<form
				onSubmit={(e) => {
					e.preventDefault();
					form.handleSubmit();
				}}
			>
				<FieldGroup>
					<form.AppField name='company_name'>{(field) => <field.Input label='Nazwa firmy' />}</form.AppField>
					<form.AppField name='email'>
						{(field) => <field.Input type={`email`} placeholder={'E-mail'} />}
					</form.AppField>

					<form.Field name='nip'>
						{(field) => {
							const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;
							return (
								<Field data-invalid={isInvalid}>
									<Input
										placeholder={'NIP'}
										inputMode='numeric' // Shows numeric keyboard on mobile
										pattern='[0-9]*' // Ensures only numbers are entered
										id={field.name}
										name={field.name}
										value={field.state.value}
										onBlur={field.handleBlur}
										aria-invalid={isInvalid}
										onChange={(e) => {
											// Only allow numbers
											const value = e.target.value.replace(/\D/g, '');
											// Limit to 10 digits
											if (value.length <= 10) {
												field.handleChange(value);
											}
										}}
									/>
									{isInvalid && <FieldError errors={field.state.meta.errors} />}
								</Field>
							);
						}}
					</form.Field>
					<form.AppField name='project_stage'>
						{(field) => (
							<field.Select placeholder={'Etap projektu'}>
								{PROJECT_STAGES.map((type) => (
									<SelectItem key={type.value} value={type.value}>
										{type.label}
									</SelectItem>
								))}
							</field.Select>
						)}
					</form.AppField>

					<FieldSet>
						<FieldContent>
							<FieldLegend>Consents</FieldLegend>
							<FieldDescription>Please accept all required consents</FieldDescription>
						</FieldContent>
						<FieldGroup data-slot='checkbox-group'>
							<form.AppField name='consents.consent1'>
								{(field) => <field.Checkbox label='Rules' />}
							</form.AppField>
							<form.AppField name='consents.consent2'>
								{(field) => <field.Checkbox label='Privacy Policy' />}
							</form.AppField>
						</FieldGroup>
					</FieldSet>

					<FieldSeparator />

					<form.Field name='users' mode='array'>
						{(field) => {
							return (
								<FieldSet>
									<div className='flex items-center justify-between gap-2'>
										<FieldContent>
											<FieldLegend variant='label' className='mb-0'>
												User Email Addresses
											</FieldLegend>
											<FieldDescription>
												Add up to 5 users to this project (including yourself).
											</FieldDescription>
											{field.state.meta.errors && <FieldError errors={field.state.meta.errors} />}
										</FieldContent>
										<Button
											type='button'
											variant='outline'
											size='sm'
											onClick={() => field.pushValue({ email: '' })}
										>
											Add User
										</Button>
									</div>
									<FieldGroup>
										{field.state.value.map((_, index) => (
											<form.Field key={index} name={`users[${index}].email`}>
												{(innerField) => {
													const isInvalid =
														innerField.state.meta.isTouched &&
														!innerField.state.meta.isValid;
													return (
														<Field orientation='horizontal' data-invalid={isInvalid}>
															<FieldContent>
																<InputGroup>
																	<InputGroupInput
																		id={innerField.name}
																		aria-invalid={isInvalid}
																		aria-label={`User ${index + 1} email`}
																		type='email'
																		onBlur={innerField.handleBlur}
																		onChange={(e) =>
																			innerField.handleChange(e.target.value)
																		}
																		value={innerField.state.value}
																	/>
																	{field.state.value.length > 1 && (
																		<InputGroupAddon align='inline-end'>
																			<InputGroupButton
																				type='button'
																				variant='ghost'
																				size='icon-xs'
																				onClick={() => field.removeValue(index)}
																				aria-label={`Remove User ${index + 1}`}
																			>
																				<XIcon />
																			</InputGroupButton>
																		</InputGroupAddon>
																	)}
																</InputGroup>
																{isInvalid && (
																	<FieldError errors={innerField.state.meta.errors} />
																)}
															</FieldContent>
														</Field>
													);
												}}
											</form.Field>
										))}
									</FieldGroup>
								</FieldSet>
							);
						}}
					</form.Field>

					<Button type='submit'>Submit</Button>
				</FieldGroup>
			</form>
		</div>
	);
}
