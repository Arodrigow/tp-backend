import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';

@ValidatorConstraint({ name: 'CPF_CNPJ', async: false })
export class CPForCNPJ implements ValidatorConstraintInterface {
  validate(text: string, args: ValidationArguments) {
    if ((text.length != 11) && (text.length != 14)) {
        return false;
    }

    if (text.length == 11) {
        let cpf = text;
        cpf = cpf.replace(/[^\d]+/g,'');    
        if(cpf == '') return false;   
        if (
            cpf.length != 11 || 
            cpf == "00000000000" || 
            cpf == "11111111111" || 
            cpf == "22222222222" || 
            cpf == "33333333333" || 
            cpf == "44444444444" || 
            cpf == "55555555555" || 
            cpf == "66666666666" || 
            cpf == "77777777777" || 
            cpf == "88888888888" || 
            cpf == "99999999999" || 
            cpf == "01234567890" )
            return false;      
        let add = 0;    
        for (let i=0; i < 9; i ++)       
        add += parseInt(cpf.charAt(i)) * (10 - i);  
        let rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11)     
            rev = 0;    
        if (rev != parseInt(cpf.charAt(9)))     
            return false;    
        add = 0;    
        for (let i = 0; i < 10; i ++)        
            add += parseInt(cpf.charAt(i)) * (11 - i);  
        rev = 11 - (add % 11);  
        if (rev == 10 || rev == 11) 
            rev = 0;    
        if (rev != parseInt(cpf.charAt(10)))
            return false;       
        return true; 
    }

    if (text.length == 14) {
        let CNPJ = text
        CNPJ = CNPJ.replace(/[^\d]+/g,''); 
        var a = new Array();
        var b: number = 0;
        var c = [6,5,4,3,2,9,8,7,6,5,4,3,2];
        for (let i=0; i<12; i++){
            a[i] = CNPJ.charAt(i);
            b += a[i] * c[i+1];
        }
        let x = 0;
        if ((x = b % 11) < 2) { a[12] = 0 } else { a[12] = 11-x }
        b = 0;
        for (let y=0; y<13; y++) {
            b += (a[y] * c[y]);
        }
        if ((x = b % 11) < 2) { a[13] = 0; } else { a[13] = 11-x; }
        if ((CNPJ.charAt(12) != a[12]) || (CNPJ.charAt(13) != a[13])){
            return false;
        }
        if (CNPJ == '00000000000000') {
            return false;
        }
        return true;
    }

  }

  defaultMessage(args: ValidationArguments) {
    // here you can provide default error message if validation failed
    return 'Text ($value) is not a valid CPF or CNPJ!';
  }
}