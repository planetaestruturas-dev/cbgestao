const normalizeHeader = (value) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

const parseBrazilianAmount = (value) => {
  const cleaned = String(value || '').replace(/[^0-9,.-]/g, '').trim();
  if (!cleaned) return 0;
  const normalized = cleaned.includes(',') ? cleaned.replaceAll('.', '').replace(',', '.') : cleaned;
  return Number(normalized) || 0;
};

export const parseStatementCsv = (text) => {
  const lines = text.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) throw new Error('O arquivo precisa ter cabeçalho e ao menos uma transação.');

  const headerLineIndex = lines.findIndex((line) => {
    const normalized = normalizeHeader(line);
    return normalized.includes('data') && normalized.includes('valor');
  });
  if (headerLineIndex === -1) throw new Error('Não encontrei o cabeçalho financeiro com Data e Valor.');

  const headerLine = lines[headerLineIndex];
  const separator = (headerLine.match(/;/g) || []).length >= (headerLine.match(/,/g) || []).length ? ';' : ',';
  const headers = headerLine.split(separator).map(normalizeHeader);
  const findColumn = (...names) => headers.findIndex((header) => names.some((name) => header.includes(name)));
  const dateIndex = findColumn('data');
  const historyIndex = findColumn('historico', 'lancamento', 'tipo');
  const descriptionIndex = findColumn('descricao', 'nome', 'detalhe');
  const amountIndex = findColumn('valor', 'amount');
  if (dateIndex === -1 || amountIndex === -1) throw new Error('Não encontrei as colunas Data e Valor no arquivo.');

  return lines.slice(headerLineIndex + 1).map((line, index) => {
    const columns = line.split(separator).map((value) => value.trim().replace(/^"|"$/g, ''));
    const rawAmount = parseBrazilianAmount(columns[amountIndex]);
    const history = historyIndex === -1 ? '' : columns[historyIndex];
    const detail = descriptionIndex === -1 ? '' : columns[descriptionIndex];
    const description = [history, detail].filter(Boolean).join(' · ') || 'Transação importada';
    return {
      id: `csv-${Date.now()}-${index}`,
      date: columns[dateIndex],
      description,
      amount: Math.abs(rawAmount),
      direction: rawAmount >= 0 ? 'Crédito' : 'Débito',
      suggestion: null,
      state: 'Pendente',
      imported: true,
    };
  }).filter((item) => item.amount > 0);
};
