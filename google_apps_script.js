function testarConexao() {
  var id = '1DyI5mZ8V3jBYubazxcScyaZxHlrgNjEn0yL_2KoCHfQ';
  try {
    var ss = SpreadsheetApp.openById(id);
    Logger.log("Conexao bem-sucedida!");
    var sheetNames = ss.getSheets().map(function(s) { return s.getName(); });
    Logger.log("Abas encontradas: " + sheetNames.join(", "));
    return "Conexao OK. Abas: " + sheetNames.join(", ");
  } catch (e) {
    Logger.log("Erro ao acessar planilha: " + e.message);
    return "Erro: " + e.message;
  }
}

// Função auxiliar para aplicar formatação padrão aos cabeçalhos
function applyHeaderFormatting(sheet, headerRow, colNome, colTurma, colRespostasStart, numRespostas, colNota) {
  var headerRange = sheet.getRange(headerRow, colNome, 1, colNota - colNome + 1);
  headerRange.setBackground("#D9EAD3"); // Verde claro
  headerRange.setFontWeight("bold");
  headerRange.setHorizontalAlignment("center");
  headerRange.setVerticalAlignment("middle");
  headerRange.setBorder(true, true, true, true, true, true, "#CCCCCC", SpreadsheetApp.BorderStyle.SOLID);

  // Ajusta a largura das colunas
  sheet.setColumnWidth(colNome, 150); // Coluna B (Nome)
  sheet.setColumnWidth(colTurma, 100); // Coluna C (Turma)
  if (numRespostas > 0) {
    for (var k = 0; k < numRespostas; k++) {
      sheet.setColumnWidth(colRespostasStart + k, 50); // Colunas de Respostas (D em diante)
    }
  }
  sheet.setColumnWidth(colNota, 70); // Coluna X (Nota)
}

// Função auxiliar para aplicar formatação padrão ao gabarito
function applyGabaritoFormatting(sheet, gabaritoRow, colRespostasStart, numRespostas) {
  if (numRespostas <= 0) return;
  var gabaritoRange = sheet.getRange(gabaritoRow, colRespostasStart, 1, numRespostas);
  gabaritoRange.setBackground("#FFF2CC"); // Amarelo claro
  gabaritoRange.setFontWeight("bold");
  gabaritoRange.setHorizontalAlignment("center");
  gabaritoRange.setVerticalAlignment("middle");
  gabaritoRange.setBorder(true, true, true, true, true, true, "#CCCCCC", SpreadsheetApp.BorderStyle.SOLID);
}

function doPost(e) {
  try {
    // 1. Captura e log dos dados recebidos
    var contents = e && e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);
    
    // 2. Acesso à planilha
    var spreadsheetId = data.spreadsheetId || '1DyI5mZ8V3jBYubazxcScyaZxHlrgNjEn0yL_2KoCHfQ';
    var ss = SpreadsheetApp.openById(spreadsheetId);
    
    // 3. Função de normalização robusta e consistente
    var normalize = function(str) {
      if (!str) return "";
      return str.toString()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "") // Remove acentos
                .replace(/[ºª]/g, "")             // Remove caracteres específicos
                .replace(/\s+/g, "")             // Remove todos os espaços em branco
                .toLowerCase()
                .trim();
    };
    
    // 4. Identificação da Aba (Turma) - Agora fixa para "Página1" conforme solicitado
    var sheetName = "Página1";
    var sheet = ss.getSheetByName(sheetName);
    
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      if (ss.getSheets().length > 1 && ss.getSheetByName('Sheet1') && ss.getSheetByName('Sheet1').getLastRow() === 0) {
        ss.deleteSheet(ss.getSheetByName('Sheet1'));
      }
    }
    
    // 5. Dados do Aluno, Nota e Respostas
    var nome = (data.nome || "").toString().trim();
    var turma = (data.turma || "").toString().trim();
    var nota = data.nota;
    var respostasAluno = data.respostas || []; // Espera um array de respostas do aluno
    
    var colNome = 2; // Coluna B
    var colTurma = 3; // Coluna C
    var colRespostasStart = 4; // Coluna D
    var colNota = 24; // Coluna X (Conforme especificado pelo usuário)
    
    // 6. Garantir que as colunas necessárias existem
    var numResp = respostasAluno.length;
    var requiredCols = Math.max(colNota, colRespostasStart + numResp - 1);
    var maxCols = sheet.getMaxColumns();
    if (maxCols < requiredCols) {
      sheet.insertColumnsAfter(maxCols, requiredCols - maxCols);
    }
    
    // 7. Definir e criar cabeçalhos e gabarito
    var gabaritoRow = 2; // Linha para o gabarito
    var headerRow = 4;   // Linha para os cabeçalhos

    // Aplica formatação geral e de cabeçalhos/gabarito
    applyHeaderFormatting(sheet, headerRow, colNome, colTurma, colRespostasStart, numResp, colNota);
    applyGabaritoFormatting(sheet, gabaritoRow, colRespostasStart, numResp);

    // Cria cabeçalhos se a planilha estiver vazia (a partir da linha 4)
    if (sheet.getRange(headerRow, colNome).isBlank()) {
      sheet.getRange(headerRow, colNome).setValue("Nome"); 
      sheet.getRange(headerRow, colTurma).setValue("Turma");
      
      // Cabeçalhos para as respostas (Q1, Q2, Q3...)
      if (numResp > 0) {
        for (var k = 0; k < numResp; k++) {
          sheet.getRange(headerRow, colRespostasStart + k).setValue("Q" + (k + 1));
        }
      }
      sheet.getRange(headerRow, colNota).setValue("Nota");
    }

    // Lê o gabarito da linha 2
    var gabarito = [];
    if (numResp > 0) {
      gabarito = sheet.getRange(gabaritoRow, colRespostasStart, 1, numResp).getValues()[0];
    }

    // 8. Localizar Aluno (Coluna B = 2)
    var startRow = 5; // Dados começam a partir da linha 5, após o cabeçalho
    var lastRow = sheet.getLastRow();
    var searchRangeHeight = Math.max(lastRow - startRow + 1, 1);
    
    var dataRange = sheet.getRange(startRow, colNome, searchRangeHeight, 1).getValues();
    var rowIndex = -1;
    var nomeBusca = normalize(nome);
    
    for (var j = 0; j < dataRange.length; j++) {
      var valorCelula = normalize(dataRange[j][0]);
      if (valorCelula === nomeBusca && nomeBusca !== "") {
        rowIndex = j + startRow; 
        break;
      }
    }
    
    // 9. Gravação dos Dados e Formatação
    var targetRow = rowIndex !== -1 ? rowIndex : Math.max(lastRow + 1, startRow);
    
    sheet.getRange(targetRow, colNome).setValue(nome);
    sheet.getRange(targetRow, colTurma).setValue(turma);
    sheet.getRange(targetRow, colNota).setValue(nota);
    
    // Grava as respostas e aplica formatação de cor
    if (numResp > 0) {
      for (var k = 0; k < numResp; k++) {
        var cell = sheet.getRange(targetRow, colRespostasStart + k);
        cell.setValue(respostasAluno[k]);
        
        // Compara com o gabarito (normalizado para evitar problemas de case/espaços)
        if (gabarito[k] && normalize(respostasAluno[k]) === normalize(gabarito[k])) {
          cell.setFontColor("#0000FF"); // Azul para correto
        } else {
          cell.setFontColor("#FF0000"); // Vermelho para incorreto
        }
      }
    }
    
    var msg = rowIndex !== -1 ? "Dados atualizados" : "Aluno novo registrado";
    return ContentService.createTextOutput("OK: " + msg + " para " + nome + " na aba " + sheetName + ".").setMimeType(ContentService.MimeType.TEXT);
    
  } catch (err) {
    return ContentService.createTextOutput("Erro Critico: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
