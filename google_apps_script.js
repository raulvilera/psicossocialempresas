/**
 * FUNÇÃO DE TESTE: Selecione esta função e clique em "Executar" para testar o acesso.
 */
function testarConexao() {
  var id = '1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws';
  try {
    var ss = SpreadsheetApp.openById(id);
    Logger.log("Conexão bem-sucedida!");
    Logger.log("Abas encontradas: " + ss.getSheets().map(s => s.getName()).join(", "));
  } catch (e) {
    Logger.log("Erro ao acessar planilha: " + e.message);
  }
}

function doPost(e) {
  var log = [];
  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);
    
    var spreadsheetId = data.spreadsheetId || '1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws';
    var ss = SpreadsheetApp.openById(spreadsheetId);
    
    // Normalização agressiva
    var normalize = function(str) {
      if (!str) return "";
      return str.toString().normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[ºª]/g, "") // Remove º e ª explicitamente
                .toLowerCase()
                .trim();
    };
    
    var turmaRaw = (data.turma || "").trim();
    var turmaNorm = normalize(turmaRaw);
    
    var sheets = ss.getSheets();
    var sheet = null;
    
    for (var i = 0; i < sheets.length; i++) {
      var sName = normalize(sheets[i].getName());
      // Busca por "8 a", "8 b", "serie a", etc.
      if (sName === turmaNorm || 
          (turmaNorm.includes("a") && sName.includes("a")) || 
          (turmaNorm.includes("b") && sName.includes("b"))) {
        sheet = sheets[i];
        break;
      }
    }
    
    if (!sheet) {
      return ContentService.createTextOutput("Erro: Aba não encontrada para '" + turmaRaw + "'. Verifique os nomes das abas.").setMimeType(ContentService.MimeType.TEXT);
    }
    
    var nome = (data.nome || "").trim();
    var nota = data.nota;
    var sheetNameActual = sheet.getName();
    
    // Mapeamento de Colunas (AA = 27, Y = 25)
    var colNota = normalize(sheetNameActual).includes("a") ? 27 : 25;
    
    // GARANTIR QUE A COLUNA EXISTE (Evita erro de Range se a planilha for pequena)
    var maxCols = sheet.getMaxColumns();
    if (maxCols < colNota) {
      sheet.insertColumnsAfter(maxCols, colNota - maxCols);
    }
    
    var lastRow = Math.max(sheet.getLastRow(), 5);
    var dataRange = sheet.getRange("B5:B" + lastRow).getValues();
    var rowIndex = -1;
    
    var nomeBusca = normalize(nome);
    for (var i = 0; i < dataRange.length; i++) {
      var valorCelula = normalize(dataRange[i][0]);
      if (valorCelula === nomeBusca) {
        rowIndex = i + 5; 
        break;
      }
    }
    
    if (rowIndex !== -1) {
      sheet.getRange(rowIndex, colNota).setValue(nota);
      return ContentService.createTextOutput("OK: Nota " + nota + " gravada na linha " + rowIndex).setMimeType(ContentService.MimeType.TEXT);
    } else {
      var nextRow = sheet.getLastRow() + 1;
      if (nextRow < 5) nextRow = 5;
      sheet.getRange(nextRow, 2).setValue(nome); 
      sheet.getRange(nextRow, colNota).setValue(nota);
      return ContentService.createTextOutput("OK: Aluno novo adicionado na linha " + nextRow).setMimeType(ContentService.MimeType.TEXT);
    }
    
  } catch (err) {
    return ContentService.createTextOutput("Erro Crítico: " + err.toString()).setMimeType(ContentService.MimeType.TEXT);
  }
}


