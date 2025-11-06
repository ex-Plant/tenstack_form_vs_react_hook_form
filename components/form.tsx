import { Controller } from "react-hook-form";
import { Field, FieldContent, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import React from "react";

export function FormInput() {
  return <Controller
    // we start by adding control - after that we are getting type safety
    // control={control}
    name={`company_name`}
    // render function  gives us state of the field
    render={({ field, fieldState }) => {
      return (
        // if data is invalid it will change the color to red
        <Field data-invalid={fieldState.invalid}>
          {/*Field content makes children insight a bit tighter*/}
          <FieldContent>
            <FieldDescription>Opis pola </FieldDescription>
            {/* If we connect htmlFor and id, clicking on the label
             will highlight the input for us*/}
            <FieldLabel htmlFor={field.name}>nip</FieldLabel>
          </FieldContent>
          {/* aria-invalid gives us styling of the whole field
           like red highlight if field is invalid */}
          <Input {...field} id={field.name} aria-invalid={fieldState.invalid} />
          {fieldState.error && <FieldError errors={[{ message: 'Error message' }]} />}
        </Field>
      );
    }}
  />
}
