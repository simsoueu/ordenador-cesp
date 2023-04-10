function Tabber(str, total) {
  // Retorna o texto com espaços à direita, até o total.
  var ret = typeof str == 'string' ? str : str.toString();
  for (var i = ret.length; i < total; ++i) ret += ' ';
  return ret;
}

function Pad(num, total) {
  // Retorna o número com zeros à esquerda, até o total.
  var zero = total - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join('0') + num;
}


function PegaCamposOrdenadores() {
  var ordenador = document.getElementById('ordenador').value;
  var ordenador2 = document.getElementById('ordenador2').value;
  var ret = [ordenador, ordenador2];

  if (ret[0].length == 0 || isNaN(ret[0])) { // validação do primeiro campo de ordenação
    alert('O campo de ordenação deve ser um valor numérico.');
    document.getElementById('ordenador').select();
    return null;
  }
  ret[0] = parseInt(ret[0]);

  if (ret[1].length > 0) { // validação do segundo campo de ordenação
    if (isNaN(ret[1])) {
      alert('O segundo campo de ordenação deve ser um valor numérico,\n' +
        'ou deixe em branco se ele não for necessário.');
      document.getElementById('ordenador2').select();
      return null;
    }
    ret[1] = parseInt(ret[1]);
  }

  if (ret[0] == ret[1]) {
    alert('Os campos de ordenação são iguais.\nIsso não faz muito sentido, não é?');
    document.getElementById('ordenador2').select();
    return null;
  }
  return ret;
}


function CriaCampoSomatorio(data) {
  var somadores = document.getElementById('somadores').value;
  if (somadores.length == 0) return true;
  somadores = somadores.split(',');

  for (var i = 0; i < somadores.length; ++i) {
    if (isNaN(somadores[i])) {
      alert('Digite os números dos campos a serem somados para formar um novo campo, ' +
        'ou deixe em branco caso um somatório não seja necessário.');
      return false;
    }
    somadores[i] = parseInt(somadores[i]);

    if (somadores[i] > data[0].length) {
      alert('O último campo de ordenação é ' + data[0].length + ', ' +
        'não existe um campo ' + somadores[i] + ' para somar.');
      document.getElementById('somadores').select();
      return false;
    }
  }

  for (var i = 0; i < data.length; ++i) {
    data[i].push(0);
    for (var j = 0; j < somadores.length; ++j)
      data[i][data[i].length - 1] += data[i][somadores[j] - 1];
  }
  return true;
}


function FormataSaida(data) {
  var output = '';
  var csvType = document.getElementById('csv').value;

  if (csvType == 'txt') {
    var longestNameLen = 0; // quantidade de caracteres do candidato com nome mais comprido

    for (var i = 0; i < data.length; ++i) { // para cada entrada
      if (data[i][1].length > longestNameLen)
        longestNameLen = data[i][1].length;
    }

    for (var i = 0; i < data.length; ++i) {
      output += Pad(i + 1, data.length.toString().length) + ' ' // ordem numérica
        + Tabber(data[i][1], longestNameLen + 1); // nome do candidato

      for (var j = 2; j < data[i].length; ++j)
        output += Tabber(data[i][j].toFixed(2), 7); // demais valores

      output += '\n';
    }
  } else {
    for (var i = 0; i < data.length; ++i) {
      output += (i + 1) + ',' // ordem numérica
        + data[i][1] + ',' // nome do candidato

      for (var j = 2; j < data[i].length; ++j)
        output += data[i][j].toFixed(2) + ','; // demais valores

      output = output.substr(0, output.length - 1) + '\n';
    }
  }

  document.getElementById('output').value = output;
}


document.addEventListener('DOMContentLoaded', function () {
  var form = document.getElementById('vai');
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var campoOrd = PegaCamposOrdenadores();
    if (campoOrd === null) return false;

    var data = document.getElementById('input').value;
    data = data.replace(/\n/g, ' ')
      .replace(/\//g, '\n')
      .replace(/\;/g, '\n')
      .split('\n');

    for (var i = 0; i < data.length; ++i) {
      data[i] = data[i].split(',');
      for (var j = 0; j < data[i].length; ++j) {
        data[i][j] = data[i][j].trim();
        if (!isNaN(data[i][j]))
          data[i][j] = parseFloat(data[i][j]);
      }
    }
    if (!CriaCampoSomatorio(data)) return false;

    if (campoOrd[0] > data[0].length || campoOrd[1] > data[0].length) {
      alert('O último campo de ordenação é ' + data[0].length + ', não ' +
        (campoOrd[0] > data[0].length ? campoOrd[0] : campoOrd[1]) + '.');
      document.querySelector(campoOrd[0] > data[0].length ? '#ordenador' : '#ordenador2').focus();
      return false;
    }

    data.sort(function (a, b) {
      if (campoOrd[1].length != '') {
        return b[campoOrd[0] - 1] != a[campoOrd[0] - 1] ?
          b[campoOrd[0] - 1] - a[campoOrd[0] - 1] :
          b[campoOrd[1] - 1] - a[campoOrd[1] - 1];
      } else {
        return b[campoOrd[0] - 1] - a[campoOrd[0] - 1];
      }
    });
    FormataSaida(data);
    return false;
  });
});
