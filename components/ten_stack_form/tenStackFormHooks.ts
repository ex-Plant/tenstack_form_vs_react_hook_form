import { createFormHook, createFormHookContexts } from '@tanstack/react-form';
import { FormInput } from '@/components/ten_stack_form/FormInput';
import { FormTextarea } from '@/components/ten_stack_form/FormTextarea';
import { FormSelect } from '@/components/ten_stack_form/FormSelect';
import { FormCheckbox } from '@/components/ten_stack_form/FormCheckbox';

const { fieldContext, formContext, useFieldContext, useFormContext } = createFormHookContexts();

const { useAppForm } = createFormHook({
	fieldComponents: {
		Input: FormInput,
		Textarea: FormTextarea,
		Select: FormSelect,
		Checkbox: FormCheckbox,
	},
	formComponents: {},
	fieldContext,
	formContext,
});

export { useAppForm, useFieldContext, useFormContext };
