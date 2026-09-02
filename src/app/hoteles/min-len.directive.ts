import { Directive, Input } from "@angular/core";
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from "@angular/forms";

@Directive({
    selector: "[minLen]",
    standalone: true,
    providers: [
        { provide: NG_VALIDATORS, useExisting: MinLenDirective, multi: true }
    ]
})
export class MinLenDirective implements Validator {
    @Input("minLen") minLength: string | number = 3;

    validate(control: AbstractControl): ValidationErrors | null {
        const requiredLen = typeof this.minLength === "string" ? parseInt(this.minLength, 10) : this.minLength;
        
        if (control.value && control.value.length < requiredLen) {
            return { minLen: { requiredLength: requiredLen, actualLength: control.value.length } };
        }
        return null;
    }
}