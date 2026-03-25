function testarConexao() {
  var id = '1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws';
  try {
    var ss = SpreadsheetApp.openById(id);
    Logger.log("Conexao bem-sucedida!");
    Logger.log("Abas encontradas: " + ss.getSheets().map(function(s) { return s.getName(); }).join(", "));
  } catch (e) {
    Logger.log("Erro ao acessar planilha: " + e.message);
  }
}

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);
    
    var spreadsheetId = data.spreadsheetId || '1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws';
    var ss = SpreadsheetApp.openById(spreadsheetId);
    
    var normalize = function(str) {
      if (!str) return "";
      return str.toString().normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[ºª]/g, "")
                .toLowerCase()
                .trim();
    };
    
    var turmaRaw = (data.turma || "").trim();
    var turmaNorm = normalize(turmaRaw);
    
    var sheets = ss.getSheets();
    var sheet = null;
    
    for (var i = 0; i < sheets.length; i++) {
      var sName = normalize(sheets[i].getName());
      if (sName === turmaNorm || 
          (turmaNorm.indexOf("a") !== -1 && sName.indexOf("a") !== -1) || 
          (turmaNorm.indexOf("b") !== -1 && sName.indexOf("b") !== -1)) {
        sheet = sheets[i];
        break;
      }
    }
    
    if (!sheet) {
      return ContentService.createTextOutput("Erro: Aba nao encontrada").setMimeType(ContentService.MimeType.TEXT);
    }
    
    var nome = (data.nome || "").trim();
    var nota = data.nota;
    
    // Conforme especificado pelo usuário: Coluna X (24)
    var colNota = 24; 

    
    var maxCols = sheet.getMaxColumns();
    if (maxCols < colNota) {
      sheet.insertColumnsAfter(maxCols, colNota - maxCols);
    }
    
    var lastRow = Math.max(sheet.getLastRow(), 5);
    var dataRange = sheet.getRange("B5:B" + lastRow).getValues();
    var rowIndex = -1;
    var nomeBusca = normalize(nome);
    
    for (var j = 0; j < dataRange.length; j++) {
      var valorCelula = normalize(dataRange[j][0]);
      if (valorCelula === nomeBusca) {
        rowIndex = j + 5; 
        break;
      }
    }
    
    if (rowIndex !== -1) {
      sheet.getRange(rowIndex, colNota).setValue(nota);
      return ContentService.createTextOutput("OK: Nota gravada").setMimeType(ContentService.MimeType.TEXT);
    } else {
      var nextRow = sheet.getLastRow() + 1;
      if (nextRow < 5) nextRow = 5;
      sheet.getRange(nextRow, 2).setValue(nome); 
      sheet.getRange(nextRow, colNota).setValue(nota);
      return ContentService.createTextOutput("OK: Aluno novo").setMimeType(ContentService.MimeType.TEXT);
    }
    
  } catch (err) {
    return ContentService.createTextOutput("Erro: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}
