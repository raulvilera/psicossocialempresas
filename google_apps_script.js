/**
 * Código para o Google Apps Script para registrar as notas da atividade.
 * Instruções:
 * 1. Abra sua planilha Google Sheets com o ID: 1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws
 * 2. Vá em Extensões > Apps Script.
 * 3. Apague o código que estiver lá e cole este.
 * 4. Clique em "Implantar" > "Nova implantação".
 * 5. Selecione o tipo "App da Web".
 * 6. Em "Quem pode acessar", escolha "Qualquer pessoa".
 * 7. Copie o URL gerado e atualize no index.html se for necessário.
 */

function doPost(e) {
  try {
    var contents = e.postData ? e.postData.contents : "{}";
    var data = JSON.parse(contents);
    
    var spreadsheetId = data.spreadsheetId || '1F1qUYkW9--r8U2eCHvOpruZue-HdQRh9T5HroiE5Rws';
    var ss = SpreadsheetApp.openById(spreadsheetId);
    
    // Normalização para lidar com caracteres como º, ª, e acentos
    var normalize = function(str) {
      return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    };
    
    var turmaRaw = (data.turma || "").trim();
    var turmaNorm = normalize(turmaRaw);
    
    // Tenta encontrar a aba por diversos nomes possíveis
    var sheets = ss.getSheets();
    var sheet = null;
    
    for (var i = 0; i < sheets.length; i++) {
      var sName = normalize(sheets[i].getName());
      if (sName === turmaNorm || 
          (turmaNorm.includes("a") && sName.includes("serie a")) || 
          (turmaNorm.includes("a") && sName.includes("ano a")) ||
          (turmaNorm.includes("b") && sName.includes("serie b")) ||
          (turmaNorm.includes("b") && sName.includes("ano b"))) {
        sheet = sheets[i];
        break;
      }
    }
    
    if (!sheet) {
      return ContentService.createTextOutput("Erro: Aba para a turma '" + turmaRaw + "' não encontrada. Verifique se o nome na planilha é exatamente '8º Ano A' ou '8ªSérie A'.").setMimeType(ContentService.MimeType.TEXT);
    }
    
    var nome = (data.nome || "").trim();
    var nota = data.nota;
    var sheetNameActual = sheet.getName();
    
    // Determinar a coluna de notas:
    var colNota = 24; 
    if (normalize(sheetNameActual).includes("a")) {
      colNota = 27; // Coluna AA
    } else if (normalize(sheetNameActual).includes("b")) {
      colNota = 25; // Coluna Y
    }
    
    var lastRow = Math.max(sheet.getLastRow(), 5);
    var dataRange = sheet.getRange("B5:B" + lastRow).getValues();
    var rowIndex = -1;
    
    var nomeBusca = normalize(nome);
    for (var i = 0; i < dataRange.length; i++) {
      var valorCelula = normalize((dataRange[i][0] || "").toString());
      if (valorCelula === nomeBusca) {
        rowIndex = i + 5; 
        break;
      }
    }
    
    if (rowIndex !== -1) {
      sheet.getRange(rowIndex, colNota).setValue(nota);
      return ContentService.createTextOutput("Sucesso: Nota " + nota + " registrada para " + nome + " na linha " + rowIndex).setMimeType(ContentService.MimeType.TEXT);
    } else {
      var nextRow = sheet.getLastRow() + 1;
      if (nextRow < 5) nextRow = 5;
      sheet.getRange(nextRow, 2).setValue(nome); 
      sheet.getRange(nextRow, colNota).setValue(nota);
      return ContentService.createTextOutput("Sucesso: Aluno não estava na lista. Novo registro criado na linha " + nextRow).setMimeType(ContentService.MimeType.TEXT);
    }
    
  } catch (err) {
    return ContentService.createTextOutput("Erro Crítico no Script: " + err.stack).setMimeType(ContentService.MimeType.TEXT);
  }
}


