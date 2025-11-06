'use client';

import { Button } from '@/components/ui/button';
import {
	Field,
	FieldContent,
	FieldDescription,
	FieldError,
	FieldGroup,
	FieldLabel,
	FieldLegend,
	FieldSeparator,
	FieldSet,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/components/ui/input-group';
import { X } from 'lucide-react';
import { FormCheckbox, FormInput, FormSelect, FormTextarea } from '@/components/react-_hook_form/AbstractedComponents';

const schema = z.object({
	company_name: z.string().min(1),
	description: z.string().min(1),
	// accept both string and number, but transform to string
	nip: z
		.string()
		.length(10, { message: 'NIP musi mieć dokładnie 10 cyfr' })
		.regex(/^[0-9]+$/, { message: 'Tylko cyfry są dozwolone' }),
	// optional field, if filled only with default empty string it will convert to undefined
	website: z
		.string()
		.optional()
		.transform((v) => v || undefined),
	project_stage: z.string().min(1),
	notifications: z.object({
		email: z.boolean(),
		sms: z.boolean(),
		push: z.boolean(),
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

type SchemaT = z.infer<typeof schema>;

const init: SchemaT = {
	company_name: '',
	nip: '',
	website: '',
	description: '',
	project_stage: '',
	notifications: {
		email: false,
		sms: false,
		push: false,
	},
	users: [{ email: '' }],
};

export default function FormHookFormWithAbstractions() {
	const form = useForm({
		defaultValues: init,
		// resolver is validating data = without it we could submit anything we want !
		resolver: zodResolver(schema),
	});

	const {
		remove: removeUser,
		append: addUser,
		fields: users,
	} = useFieldArray({
		name: 'users',
		control: form.control,
	});

	function onSubmit() {
		console.log(`🚀 formData: `, form.formState);
		form.reset();
	}

	console.log(`❌ errors: `, form.formState.errors);

	return (
		<>
			{/* It is ok to use normal form element with fields  */}
			<form onSubmit={form.handleSubmit(onSubmit)} action='' className={`w-full`}>
				{/* Field Group is adding space between fields*/}
				<FieldGroup>
					<FormInput name={'company_name'} label={''} control={form.control} />
					{/*  Field set is allowing to create a subset of different elements inside one thing
             return */}
					<FieldSet>
						<FieldContent>
							<FieldLegend>Notifications</FieldLegend>
							<FieldDescription>Select how you want to receive notifications</FieldDescription>
						</FieldContent>
						<FormCheckbox name={'notifications.email'} label={'Email'} control={form.control} />{' '}
						<FormCheckbox name={'notifications.sms'} label={'Sms'} control={form.control} />{' '}
						<FormCheckbox name={'notifications.push'} label={'Push'} control={form.control} />
					</FieldSet>
					<FormTextarea name={'description'} label={'description'} control={form.control} />
					<FormSelect name={'project_stage'} label={'Etap projektu'} control={form.control}>
						<SelectItem value='concept'>koncepcja</SelectItem>
						<SelectItem value='project'>projekt wykonawczy</SelectItem>
						<SelectItem value='realization'>realizacja</SelectItem>
					</FormSelect>

					<FieldSeparator />
					<FieldSet>
						<div className={`flex items-center `}>
							<FieldContent>
								{/*variant.label will make text smaller*/}
								<FieldLegend className={`mb-0`} variant={'label'}>
									Users
								</FieldLegend>
								<FieldDescription>Add up to 5 users </FieldDescription>

								{/*this will check for any error in the parent category for example if we have
                    too many users*/}
								{form.formState.errors.users && (
									<FieldError errors={[form.formState.errors.users?.root]} />
								)}
							</FieldContent>
							<Button type={`button`} onClick={() => addUser({ email: '' })}>
								Add{' '}
							</Button>
						</div>
					</FieldSet>

					<FieldGroup>
						{users.map((user, index) => {
							return (
								<Controller
									key={index}
									control={form.control}
									name={`users.${index}.email`}
									render={({ field, fieldState }) => {
										return (
											<Field aria-invalid={fieldState.invalid}>
												<InputGroup>
													<InputGroupInput
														type={'email'}
														aria-invalid={fieldState.invalid}
														{...field}
														id={field.name}
														aria-label={`User ${index + 1} email`}
													/>
													<InputGroupAddon align={`inline-end`}>
														<InputGroupButton
															aria-label={`Remove user ${index + 1} email`}
															type={`button`}
															onClick={() => removeUser(index)}
														>
															<X />
														</InputGroupButton>
													</InputGroupAddon>
												</InputGroup>
												{fieldState.error && <FieldError errors={[fieldState.error]} />}
											</Field>
										);
									}}
								/>
							);
						})}
					</FieldGroup>
				</FieldGroup>

				<Button type={'submit'}>submit</Button>
			</form>
		</>
	);
}
