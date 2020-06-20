/* 
  Path: app/shared/permission.model.ts
  Objective: Define permission model
  Author: Esme López 
*/

export class Permission {
    id: number;
    text: string;
    allow: boolean;

    constructor(id:number, text: string){
        this.id = id;
        this.text = text;
    }
}