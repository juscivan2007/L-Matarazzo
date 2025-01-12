const reservas = [];

function selecionarMesa(numeroMesa) {
    const mesas = document.querySelectorAll('.mesa');
    const mesaSelecionada = mesas[numeroMesa - 1];

    // Adicionando a classe 'selecionada' à mesa que foi clicada
    mesaSelecionada.classList.add('selecionada');
    document.getElementById('mesaNumero').value = numeroMesa;

    // Atualizando os horários disponíveis para a mesa selecionada
    atualizarHorariosDisponiveis(numeroMesa);
}

document.getElementById('formularioReserva').addEventListener('submit', function (evento) {
    evento.preventDefault();

    const numeroMesa = document.getElementById('mesaNumero').value;
    const mesa = document.querySelector(`.mesa:nth-child(${numeroMesa})`);
    const data = document.getElementById('data').value;
    const horario = document.getElementById('horario').value;

    if (!mesa) {
        mostrarAviso('Por favor, selecione uma mesa antes de enviar o formulário.');
        return;
    }

    const horarioFim = calcularHorarioFim(horario);
    const reservaAtual = { numeroMesa, data, horario, horarioFim };

    if (verificarDisponibilidade(reservaAtual)) {
        reservas.push(reservaAtual);
        mesa.classList.add('reservada');
        mostrarAviso(`Mesa ${numeroMesa} foi reservada com sucesso!\nData: ${data}\nHorário: ${horario} - ${horarioFim}`);
        this.reset();
    } else {
        mostrarAviso('Esse horário já está reservado para essa mesa. Por favor, escolha outro horário.');
    }
});

function calcularHorarioFim(horarioInicio) {
    const [horas, minutos] = horarioInicio.split(':').map(Number);
    const horarioFim = new Date();
    horarioFim.setHours(horas, minutos);
    horarioFim.setHours(horarioFim.getHours() + 1); // Duração fixa de 1 hora
    return horarioFim.toTimeString().slice(0, 5);
}

function verificarDisponibilidade(reserva) {
    return !reservas.some(r =>
        r.numeroMesa === reserva.numeroMesa &&
        r.data === reserva.data &&
        r.horario === reserva.horario
    );
}

function atualizarHorariosDisponiveis(numeroMesa) {
    const dataSelecionada = document.getElementById('data').value;
    const horariosSelect = document.getElementById('horario');
    horariosSelect.innerHTML = '<option value="">Selecione o horário</option>';

    const horariosDisponiveis = [
        '18:30', '19:30', '20:30', '21:30', '22:30'
    ];

    const reservasMesa = reservas.filter(r => r.numeroMesa == numeroMesa && r.data == dataSelecionada);

    horariosDisponiveis.forEach(horario => {
        if (!reservasMesa.some(r => r.horario === horario)) {
            const option = document.createElement('option');
            option.value = horario;
            option.textContent = horario;
            horariosSelect.appendChild(option);
        }
    });
}

function mostrarAviso(mensagem) {
    const avisoPopup = document.getElementById('avisoPopup');
    const avisoTexto = document.getElementById('avisoTexto');
    avisoTexto.textContent = mensagem;
    avisoPopup.style.display = 'flex';
}

function fecharAviso() {
    const avisoPopup = document.getElementById('avisoPopup');
    avisoPopup.style.display = 'none';
}
