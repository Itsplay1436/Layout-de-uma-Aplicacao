//DESCONTINUADO
export function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

export function validarCodigoBarras(codigo) {
    return /^[0-9]{13}$/.test(codigo);
}

export function notificar(mensagem, tipo = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${tipo}`;
    notification.textContent = mensagem;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

export function setupAutoValidation(form) {
    const inputs = form.querySelectorAll('[data-validation]');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => validateInput(input));
        
        input.addEventListener('blur', () => validateInput(input, true));
    });

    form.addEventListener('submit', (e) => {
        let isValid = true;
        inputs.forEach(input => {
            if (!validateInput(input, true)) {
                isValid = false;
            }
        });

        if (!isValid) {
            e.preventDefault();
            notificar('Por favor, corrija os campos destacados', 'error');
        }
    });
}

function validateInput(input, showError = false) {
    const validationType = input.dataset.validation;
    let isValid = true;

    switch(validationType) {
        case 'codigo-barras':
            isValid = /^[0-9]{13}$/.test(input.value);
            break;
        case 'preco':
            isValid = parseFloat(input.value) > 0;
            break;
        case 'texto':
            isValid = input.value.trim().length >= 3;
            break;
        case 'estoque':
            isValid = Number.isInteger(Number(input.value)) && parseInt(input.value) > 0;
            break;
    }

    if (showError && !isValid && input.value) {
        input.classList.add('invalid');
        const errorMsg = input.nextElementSibling?.classList.contains('error-msg') 
            ? input.nextElementSibling 
            : createErrorElement(input);
        errorMsg.textContent = getErrorMessage(validationType);
    } else {
        input.classList.remove('invalid');
        if (input.nextElementSibling?.classList.contains('error-msg')) {
            input.nextElementSibling.textContent = '';
        }
    }

    return isValid;
}

function createErrorElement(input) {
    const errorElement = document.createElement('small');
    errorElement.className = 'error-msg';
    input.insertAdjacentElement('afterend', errorElement);
    return errorElement;
}

function getErrorMessage(type) {
    const messages = {
        'codigo-barras': 'Código deve ter 13 dígitos numéricos',
        'preco': 'Digite um valor positivo',
        'texto': 'Mínimo 3 caracteres',
        'estoque': 'Digite um número inteiro positivo'
    };
    return messages[type] || 'Valor inválido';
}