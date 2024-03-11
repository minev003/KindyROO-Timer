// Приема:
//      field: HTML Field (input, textarea, select, ....)
//      blured: boolean - (true) когато се извиква от onblur() метода
// Връща:
//      нищо
// Описание:
//      Добавя 'валиден' или 'НЕ валиден' клас на филда
//      чрез който показваме съответният фиидбек.
// Идеята:
//      Тестваме след всяка промяна на стойността,
//      но чак след като потребителят е приключил с въвеждането.
// Действие:
//      Преди всичко правим beforeCheck който проверява от къде e извикан валидатора.
//      Ако има поне едно извикване от 'onblur()' метода:
//          1.добавяме клас 'blured' и вече може да бъде тестван.
//          2.Подготвя полето за тестване като маха валидиращите класове
//          3.Проверяза дали се изисква
//      Ако всичко това е ОК правим проверката на стойността.
//
// Използване:
// <input .......
//        value={ip}
//        onChange={({target}) => {setIp(target?.value); Validate.ipv4(target)}}
//        onBlur={({target}) => Validate.ipv4(target, true)}
// />
// <div className="invalid-feedback">{ ip ? Validate.ipv4Err : Validate.requireErr}</div>
// <div className="valid-feedback">Valid message</div>
function Validate() {
    Validate.prototype.displayNameErr = 'Field contain only whitespaces!';
    Validate.prototype.loginNameErr = 'Invalid Login Name!';
    Validate.prototype.hostNameErr = 'Invalid Host Name!';
    Validate.prototype.portErr = 'Invalid Port!';
    Validate.prototype.passwordErr = 'Invalid Password!';
    Validate.prototype.ipv4Err = 'Field should contain valid IPv4 address!';
    Validate.prototype.ipv6Err = 'Field should contain valid IPv6 address!';
    Validate.prototype.urlErr = 'Field should contain valid URL address!';
    Validate.prototype.sipUrlErr = 'Field should contain valid SIP URL address!';
    Validate.prototype.requireErr = 'This field can not be empty';

    Validate.prototype.displayName = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        if(field.value.trim().length > 0){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.loginName = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        if(/^[\w-]{3,}$/.test(field.value)){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.hostName = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        if(/^(([\w]|[\w][\w\-]*[\w])\.)*([\w]|[\w][\w\-]*[\w])$/.test(field.value)){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.port = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        if(field.value >= 0 && field.value <= 65535){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.password = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        if(/^[^+/\\%^&()@#][\S]{3,}$/.test(field.value)){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.ipv4 = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        if(/^(?:(?:^|\.)(?:2(?:5[0-5]|[0-4]\d)|1?\d?\d)){4}$/.test(field.value)){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.ipv6 = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        var pattern = new RegExp('^((?=.*::)(?!.*::.+::)(::)?([\\dA-F]{1,4}:' +
            '(:|\\b)|){5}|([\\dA-F]{1,4}:){6})((([\\dA-F]{1,4}' +
            '((?!\\3)::|:\\b|$))|(?!\\2\\3)){2}|(((2[0-4]|1\\d|[1-9])?' +
            '\\d|25[0-5])\\.?\\b){4})$', 'i');

        if(pattern.test(field.value)){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.url = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        var pattern = new RegExp('^([a-z][a-z0-9+.-]*):(?:\\/\\/((?:(?=((?:[a-z0-9-._~!$&\'()*+,;=:]|%[0-9A-F]{2})*))(\\3)@)?(?=(\\[[0-9A-F:.]{2,}\\]|(?:[a-z0-9-._~!$&\'()*+,;=]|%[0-9A-F]{2})*))\\5(?::(?=(\\d*))\\6)?)(\\/(?=((?:[a-z0-9-._~!$&\'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\8)?|(\\/?(?!\\/)(?=((?:[a-z0-9-._~!$&\'()*+,;=:@\\/]|%[0-9A-F]{2})*))\\10)?)(?:\\?(?=((?:[a-z0-9-._~!$&\'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\11)?(?:#(?=((?:[a-z0-9-._~!$&\'()*+,;=:@\\/?]|%[0-9A-F]{2})*))\\12)?$', "gmi");
        if(pattern.test(field.value)){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    Validate.prototype.sipUrl = function (field, blured) {
        if(!beforeCheck(field, blured)) {return;}

        var pattern = new RegExp('^sip[s]?:((\\+?[\\d-]+(:\\d{1,4})?)|([\\w.\\-:;=?]+))@?((((25[0-5]|2[0-4][0-9]|1?[0-9]{1,2}).){3}(25[0-5]|2[0-4][0-9]|1?[0-9]{1,2}:\\d{1,4}([\\w.;=?%&-]+)?))|([\\w.;\\-=?%&]+(:\\d{1,4};?([\\w=]+)?)?))$', "gm");
        if(pattern.test(field.value)){
            field.classList.add('is-valid');
            return;
        }

        field.classList.add('is-invalid');
    }

    const beforeCheck = function (field, blured) {
        if(blured){ field.classList.add('blured');}
        // Тестваме само ако потрбителя и приключил с въвеждането
        if(field.classList.contains('blured')){
            field.classList.remove('is-invalid', 'is-valid')

            if(field.value.length === 0){
                return require(field);
            }
            return true
        }
        return false;
    }
    const require = function (field) {
        // Ако не се изисква
        if(!field.required ){
            field.classList.add('is-valid')
            return;
        }
        // Ако се изисква, 'value' трябва да е нещо
        if(field.value){
            field.classList.add('is-valid')
            return;
        }
        // Няма 'value'
        field.classList.add('is-invalid')
    }
}
const obj = new Validate()
export default obj