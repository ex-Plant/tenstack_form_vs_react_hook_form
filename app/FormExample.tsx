'use client';

import { Button } from '@/components/ui/button';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useActionState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

const schema = z.object({
  company_name: z.string().min(1),
  email: z.string().length(3, { message: 'Podaj prawdziwy email' }),
  // accept both string and number, but transform to string
  projects_per_year: z.union([z.string().min(1), z.number().min(1)]).transform((value) => String(value)),
  nip: z
    .string()
    .length(10, { message: 'NIP musi mieć dokładnie 10 cyfr' })
    .regex(/^[0-9]+$/, { message: 'Tylko cyfry są dozwolone' }),
  // optional field, if filled only with default empty string it will convert to undefined
  website: z
    .string()
    .optional()
    .transform((v) => v || undefined),
  city: z.string().min(1),
  project_type: z.string().min(1),
  completion_date: z.string().min(1),
  project_stage: z.string().min(1),
  project_area: z.string().min(1),
  project_budget: z.string().min(1),
  notifications: z.object({
    email: z.string(),
    sms: z.string(),
    push: z.boolean(),
  }),
});

type SchemaT = z.infer<typeof schema>;

const init: SchemaT = {
  company_name: '',
  nip: '',
  email: '',
  website: '',
  projects_per_year: '',
  city: '',
  project_type: '',
  completion_date: '',
  project_stage: '',
  project_area: '',
  project_budget: '',
};

export default function FormExample() {
  const form = useForm({
    defaultValues: init,
    // resolver is validating data = without it we could submit anything we want !
    resolver: zodResolver(schema),
  });


  function onSubmit() {
    form.reset();
  }

  return (
    <>
      <div className={`px-r container mx-auto my-6 mt-20`}>
        {/* It is ok to use normal form element with fields  */}
        <form action=''>
          {/* Field Group is adding space between fields*/}

          <FieldGroup>
            {/* 💥INPUT*/}
            {/* Controller is from React Hook Form to connect everything properly */}
            <Controller
              // we start by adding control - after that we are getting type safety
              control={form.control}
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

            {/* 💥TEXT AREA */}
            <Controller
              control={form.control}
              name={`city`}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Text Area</FieldLabel>
                    <Textarea {...field} id={field.name} aria-invalid={fieldState.invalid} />
                    {fieldState.error && <FieldError errors={[{ message: 'Error message' }]} />}
                  </Field>
                );
              }}
            />

            {/*💥 SELECT */}
            <Controller
              control={form.control}
              name={'project_stage'}
              render={({ field: { onChange, ...field }, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Etap Projektu</FieldLabel>
                    <Select {...field} name={'project_stage'} onValueChange={onChange}>
                      {/*IN SELECTS WE CONNECT htmlFor WITH TRIGGER, same
                       with aria-invalid❗*/}
                      <SelectTrigger
                        aria-invalid={fieldState.invalid}
                        className='w'
                        id={field.name}
                      >
                        <SelectValue placeholder='Etap projektu' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='concept'>koncepcja</SelectItem>
                        <SelectItem value='project'>projekt wykonawczy</SelectItem>
                        <SelectItem value='realization'>realizacja</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.error && <FieldError errors={[{ message: 'message' }]} />}
                  </Field>
                );
              }}
            />
            {/* NIP - SPECIAL CASE */}
            <Controller
              control={form.control}
              name={`nip`}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldContent>
                      <FieldDescription>Opis pola </FieldDescription>

                      <FieldLabel htmlFor={field.name}>nip</FieldLabel>
                    </FieldContent>
                    <Input
                      {...field}
                      type='text'
                      inputMode='numeric' // Shows numeric keyboard on mobile
                      pattern='[0-9]*' // Ensures only numbers are entered
                      id={field.name}
                      aria-invalid={fieldState.invalid}
                      value={field.value}
                      onChange={(e) => {
                        // Only allow numbers
                        const value = e.target.value.replace(/\D/g, '');
                        // Limit to 10 digits
                        if (value.length <= 10) {
                          field.onChange(value);
                        }
                      }}
                    />
                    {fieldState.error && <FieldError errors={[{ message: 'Error message' }]} />}
                  </Field>
                );
              }}
            />
          </FieldGroup>

          <Button>submit</Button>
        </form>
      </div>
      <div></div>
    </>
  );
}
