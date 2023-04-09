import { FormControl } from '@angular/forms';

export interface SingupFormGroup {
  username: FormControl<string>;
  password: FormControl<string>;
  confirmPassword: FormControl<string>;
  nationality: FormControl<string>;
  email: FormControl<string>;
  ipAddress: FormControl<string>;
}
