function calcularINSS(salario) {
  const faixas = [
    { limite: 1320.00, aliquota: 0.075 },
    { limite: 2571.29, aliquota: 0.09 },
    { limite: 3856.94, aliquota: 0.12 },
    { limite: 7507.49, aliquota: 0.14 }
  ];

  let total = 0;
  let restante = salario;
  let anterior = 0;

  for (let i = 0; i < faixas.length; i++) {
    const faixa = faixas[i];
    if (salario > faixa.limite) {
      total += (faixa.limite - anterior) * faixa.aliquota;
      anterior = faixa.limite;
    } else {
      total += (salario - anterior) * faixa.aliquota;
      break;
    }
  }

  return Math.min(total, 877.24); // teto de INSS em 2023/2024
}

function calcularIRPF(base) {
  const faixas = [
    { de: 0, ate: 2112.00, aliquota: 0, deducao: 0 },
    { de: 2112.01, ate: 2826.65, aliquota: 0.075, deducao: 158.40 },
    { de: 2826.66, ate: 3751.05, aliquota: 0.15, deducao: 370.40 },
    { de: 3751.06, ate: 4664.68, aliquota: 0.225, deducao: 651.73 },
    { de: 4664.69, ate: Infinity, aliquota: 0.275, deducao: 884.96 }
  ];

  for (let faixa of faixas) {
    if (base >= faixa.de && base <= faixa.ate) {
      return base * faixa.aliquota - faixa.deducao;
    }
  }

  return 0;
}

function calcular() {
  const valorHora = parseFloat(document.getElementById('valorHora').value);
  if (valorHora === 0) return alert('Encerrando sistema.');

  const horas = parseFloat(document.getElementById('horas').value);
  const valeTransporte = document.getElementById('valeTransporte').value;
  const outrasDeducoes = parseFloat(document.getElementById('outrasDeducoes').value || 0);

  const salarioBruto = valorHora * horas;
  const descontoINSS = calcularINSS(salarioBruto);
  const baseIR = salarioBruto - descontoINSS;
  const descontoIRPF = calcularIRPF(baseIR);
  const descontoVT = (valeTransporte === 'S') ? salarioBruto * 0.06 : 0;
  const salarioLiquido = salarioBruto - descontoINSS - descontoIRPF - descontoVT - outrasDeducoes;

  const saida = document.getElementById('saida');
  saida.classList.remove('hidden');
  saida.innerHTML = `
    <strong>CÁLCULO TRABALHISTA</strong><br>
    Salário Bruto: R$ ${salarioBruto.toFixed(2)}<br>
    Desconto INSS: R$ ${descontoINSS.toFixed(2)}<br>
    Desconto IRPF: R$ ${descontoIRPF.toFixed(2)}<br>
    Desconto Vale Transporte: R$ ${descontoVT.toFixed(2)}<br>
    Outras Deduções: R$ ${outrasDeducoes.toFixed(2)}<br>
    <strong>Salário Líquido: R$ ${salarioLiquido.toFixed(2)}</strong>
  `;
}
