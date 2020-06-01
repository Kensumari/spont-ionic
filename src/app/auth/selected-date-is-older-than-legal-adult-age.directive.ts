import { Directive } from "@angular/core";
import {
  NG_VALIDATORS,
  Validator,
  AbstractControl,
  ValidationErrors,
} from "@angular/forms";
import { subYears, compareAsc } from "date-fns";

@Directive({
  selector: "[appSelectedDateIsOlderThanLegalAdultAge]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: SelectedDateIsOlderThanLegalAdultAgeDirective,
      multi: true,
    },
  ],
})
export class SelectedDateIsOlderThanLegalAdultAgeDirective
  implements Validator {
  constructor() {}
  validate(control: AbstractControl): ValidationErrors | null {
    if (typeof control.value !== "string") {
      throw new TypeError("This validator can only be used with date strings");
    }
    const userDateOfBirth = new Date(control.value);
    const eighteenYearsAgo = subYears(new Date(), 18);
    return compareAsc(userDateOfBirth, eighteenYearsAgo) === 1
      ? { selectedDateIsOlderThanLegalAdultAge: { value: control.value } }
      : null;
  }
}
