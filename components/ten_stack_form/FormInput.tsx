import { Input } from '@/components/ui/input';
import { FormBase, FormControlProps } from './FormBase';
import { useFieldContext } from '@/components/ten_stack_form/tenStackFormHooks';

export function FormInput(props: FormControlProps) {
	const field = useFieldContext<string>();
	const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid;

	return (
		<FormBase {...props}>
			<Input
				placeholder={props.placeholder}
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
				aria-invalid={isInvalid}
				type={props.type}
			/>
		</FormBase>
	);
}
