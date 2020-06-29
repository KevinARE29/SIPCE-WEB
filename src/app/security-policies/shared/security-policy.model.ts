/* 
  Path: app/security-policies/shared/security-policy.model.ts
  Objective: Define security policy model
  Author: Esme López 
*/

export class SecurityPolicy {
  public id: number;
  public minLength: number;
  public capitalLetter: boolean;
  public lowerCase: boolean;
  public specialChart: boolean;
  public numericChart: boolean;
  public minActive: boolean;
}
