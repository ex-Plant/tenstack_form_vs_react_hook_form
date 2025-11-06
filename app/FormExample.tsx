'use client';

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldLegend, FieldSeparator, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group";
import { X } from "lucide-react";

const schema = z.object({
  company_name: z.string().min(1),
  description: z.string().min(1),
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
  project_stage: z.string().min(1),
  notifications: z.object({
    email: z.boolean(),
    sms: z.boolean(),
    push: z.boolean(),
  }),
  users: z.array(z.object({
    email: z.email(),
  })).min(1).max(5)
});

type SchemaT = z.infer<typeof schema>;

const init: SchemaT = {
  company_name: '',
  nip: '',
  website: '',
  description: '',
  projects_per_year: '',
  project_stage: '',
  notifications: {
    email: false,
    sms: false,
    push: false,
  },
  users: [{email: ""}]
};

export default function FormExample() {
  const form = useForm({
    defaultValues: init,
    // resolver is validating data = without it we could submit anything we want !
    resolver: zodResolver(schema),
  });

  const {remove: removeUser, append: addUser, fields: users} = useFieldArray({
    name: 'users',
    control: form.control
  })


  function onSubmit() {

    form.reset();
  }

  return (
    <>
        {/* It is ok to use normal form element with fields  */}
        <form action=''>
          {/* Field Group is adding space between fields*/}
          <FieldGroup>

            {/*  Field set is allowing to create a subset of different elements inside one thing
             return */}
            <FieldSet>
                <FieldContent>
                  <FieldLegend>Notifications</FieldLegend>
                  <FieldDescription>Select how you want to receive notifications</FieldDescription>
                </FieldContent>


              {/* 💥Checkboxes */}
                {/* Again for styling reasons we can add fieldGroup and if we add data-slot
                 attribute it will make elements inside closer to each other */}
                <FieldGroup data-slot={'checkbox-group'} >
                  <Controller
                    control={form.control}
                    name={`notifications.email`}
                    render={({ field: {value, onChange, ...field}, fieldState }) => {
                      return (
                        /*We need to move label under checkbox and add horizontal to make it
                         styling work*/
                        <Field data-invalid={fieldState.invalid } orientation={'horizontal'}>
                          <Checkbox {...field} checked={value} onCheckedChange={onChange} id={field.name} aria-invalid={fieldState.invalid} />
                          <FieldLabel htmlFor={field.name}>Email </FieldLabel>

                          {fieldState.error &&
                            // we can add fieldContent to make error show beneath instead of
                            // next to the checkbox
                            <FieldContent>
                              <FieldError errors={[{ message: 'Error message' }]} />
                            </FieldContent>
                          }
                        </Field>
                      );
                    }}
                  />
                  <Controller
                    control={form.control}
                    name={`notifications.sms`}
                    render={({ field: {value, onChange, ...field}, fieldState }) => {
                      return (
                        <Field data-invalid={fieldState.invalid } orientation={'horizontal'}>
                          <Checkbox {...field} checked={value} onCheckedChange={onChange} id={field.name} aria-invalid={fieldState.invalid} />
                          <FieldLabel htmlFor={field.name}>Sms </FieldLabel>
                          {fieldState.error && <FieldError errors={[{ message: 'Error message' }]} />}
                        </Field>
                      );
                    }}
                  />
                  <Controller
                    control={form.control}
                    name={`notifications.push`}
                    render={({ field: {value, onChange, ...field}, fieldState }) => {
                      return (
                          <Field data-invalid={fieldState.invalid } orientation={'horizontal'}>
                          <Checkbox {...field} checked={value} onCheckedChange={onChange} id={field.name} aria-invalid={fieldState.invalid} />
                          <FieldLabel htmlFor={field.name}>push </FieldLabel>
                          {fieldState.error && <FieldError errors={[{ message: 'Error message' }]} />}
                        </Field>
                      );
                    }}
                  />
                </FieldGroup>
              </FieldSet>
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
              name={`description`}
              render={({ field, fieldState }) => {
                return (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>Text Area </FieldLabel>
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
              // With selects we need to extract onBlur and onChange to pass it to correct
              //  components, onBlur needs to go to trigger, onChange will be triggered by
              //   onValueChange
              render={({ field: { onChange, onBlur, ...field }, fieldState }) => {
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
                        onBlur={onBlur}
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
                      <FieldLabel htmlFor={field.name}>nip</FieldLabel>
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

            <FieldSeparator/>
            <FieldSet>
              <div className={`flex items-center `}>
                <FieldContent>
                  {/*variant.label will make text smaller*/}
                  <FieldLegend className={`mb-0`} variant={'label'}>Users</FieldLegend>
                  <FieldDescription>Add up to 5 users </FieldDescription>

                  {/*this will check for any error in the parent category for example if we have
                    too many users*/}
                  {form.formState.errors.users && <FieldError errors={[form.formState.errors.users?.root]} />}
                </FieldContent>
                <Button type={`button`} onClick={() => addUser({email: ''})} >Add </Button>
              </div>
            </FieldSet>
            <Button>submit</Button>

            <FieldGroup>
              {users.map((user, index) => {
                return(
                  <Controller
                          control={form.control}
                          name={`users.${index}.email`}
                          render={({field, fieldState }) => {
                            return <Field aria-invalid={fieldState.invalid}>
                              <InputGroup>
                                <InputGroupInput type={'email'} aria-invalid={fieldState.invalid} {...field} id={field.name}
                                aria-label={`User ${index + 1} email`}
                                />
                                  <InputGroupAddon align={`inline-end`} >
                                    <InputGroupButton
                                      aria-label={`Remove user ${index + 1} email`}
                                      type={`button`} onClick={() => removeUser(index)}><X /></InputGroupButton>
                                  </InputGroupAddon>
                              </InputGroup>
                              {fieldState.error && <FieldError errors={[fieldState.error]}/>}
                            </Field>
                          }}
                  />)
              })}
            </FieldGroup>
          </FieldGroup>

        </form>
    </>
  );
}
