import { Checkbox } from '@/components/ui/checkbox';
import { FormBase, FormControlProps } from './FormBase';
import { useFieldContext } from '@/components/ten_stack_form/tenStackFormHooks';

export function FormCheckbox(props: FormControlProps) {
	const field = useFieldContext<boolean>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<FormBase {...props} controlFirst horizontal>
			<Checkbox
				id={field.name}
				name={field.name}
				checked={field.state.value}
				onBlur={field.handleBlur}
				onCheckedChange={(e) => field.handleChange(e === true)}
				aria-invalid={isInvalid}
				className={`mr-2`}
			/>
		</FormBase>
	);
}
