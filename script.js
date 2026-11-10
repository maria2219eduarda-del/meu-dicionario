(function () {
  'use strict';

  var TEAM = [
    ['Alex Sander de Jesus Carvalho', 'Data Owner (Regras de Negócio)'],
    ['Bruno Gabriel dos Santos', 'Data Owner (Regras de Negócio)'],
    ['Douglas de Siqueira Vicente', 'Data Steward (Qualidade Técnica e Dicionário)'],
    ['Eduardo Alcantara Dias da Silva', 'Data Steward (Qualidade Técnica e Dicionário)'],
    ['Enzo Rocha Vecchio', 'Data Steward (Qualidade Técnica e Dicionário)'],
    ['Guilherme Marques Bento', 'Data Steward (Qualidade Técnica e Dicionário)'],
    ['Guilherme Pereira da Silva Franco', 'Data Owner (Regras de Negócio)'],
    ['Guilherme Silva Alves', 'Data Owner (Regras de Negócio)'],
    ['Isaac Ben Fernandes dos Santos', 'Data Owner (Regras de Negócio)'],
    ['João Vitor Nunes de Aquino', 'Data Steward (Qualidade Técnica e Dicionário)'],
    ['Maria Eduarda Pereira Araújo', 'Data Steward (Qualidade Técnica e Dicionário)'],
    ['Vitorya Grazyeli Rodrigues', 'Data Owner (Regras de Negócio)']
  ];

  /* Atalhos de constraints. Token iniciado por "!" = texto literal. */
  var TOK = {
    AI: 'AUTO_INCREMENT', B01: 'CHECK IN (0,1)', G0: 'CHECK > 0', GE: 'CHECK >= 0',
    CUR: 'DEFAULT CURRENT_TIMESTAMP', D0: 'DEFAULT 0', D1: 'DEFAULT 1',
    Z: 'DEFAULT 0.00', Z3: 'DEFAULT 0.000', VIEW: 'VISÃO (derivado)'
  };

  /* Formato:
     =Grupo
     @tabela|Finalidade|Origem|Destino|RBAC da tabela
     atributo|Tipo|Constraints(;)|LGPD|Descrição|[RBAC da coluna]|[Linhagem da coluna] */
  var DD = [
'=Bloco 1: Cadastros e acessos',
'@cliente|Armazena os dados cadastrais, de contato e de consentimento LGPD das clientes do salão (RF01).|Cadastro na recepção por atendente ou administrador; consentimento coletado do titular|ficha_capilar, restricao_cliente e agendamento; histórico RF09|ADM: C,R,U; ATD: C,R,U',
'id_cliente|INT|PK;AI;NN|N/A|Identificador único da cliente.',
'nome|VARCHAR(100)|NN|DP|Nome completo da cliente; é anonimizado sob demanda do titular (PR01).',
'telefone|VARCHAR(20)|NN|DP|Telefone de contato; é anonimizado sob demanda do titular.',
'email|VARCHAR(100)|UQ;NULL|DP|E-mail opcional; não pode se repetir entre clientes.',
'data_nascimento|DATE|NULL|DP|Data de nascimento opcional.',
'data_consentimento|TIMESTAMP|NULL|DP|Momento do consentimento LGPD; só é preenchida com consentimento expresso.',
'status_consentimento|TINYINT(1)|NN;D0;B01|DP|1 = consentiu; 0 = não consentiu (padrão).',
'ativo|TINYINT(1)|NN;D1;B01|N/A|Inativação lógica; 0 impede novos agendamentos (RN13).',
'cpf|VARCHAR(11)|UQ;NULL|DP|CPF somente com dígitos; único por cliente (RF01).',
'data_anonimizacao|DATETIME|NULL|N/A|Data em que a anonimização LGPD foi executada; nula enquanto não houver pedido.',
'@ficha_capilar|Registra a avaliação capilar base de cada cliente.|Avaliação técnica feita pelo profissional|detalhe_ficha_quimica; histórico capilar RF09|ADM: C,R,U; ATD: C,R,U',
'id_ficha|INT|PK;AI;NN|N/A|Identificador único da ficha.',
'id_cliente|INT|FK:cliente.id_cliente;NN|N/A|Cliente avaliada.',
'tipo_cabelo|VARCHAR(50)|NN|DP|Tipo de cabelo (por exemplo, liso, ondulado, cacheado).',
'observacoes_gerais|TEXT|NULL|DPS|Texto livre da avaliação; pode conter condição de saúde do couro cabeludo.',
'data_avaliacao|DATETIME|NN;CUR|N/A|Data e hora da avaliação (RF09).',
'@detalhe_ficha_quimica|Decompõe de forma atômica (1FN) o histórico de procedimentos químicos aplicados ao cabelo.|Profissional, na anamnese ou após o procedimento|Histórico capilar RF09; vínculo com o atendimento|ADM: C,R,U; ATD: C,R,U',
'id_detalhe|INT|PK;AI;NN|N/A|Identificador do registro químico.',
'id_ficha|INT|FK:ficha_capilar.id_ficha;NN|N/A|Ficha capilar à qual o registro pertence.',
'tipo_quimica|VARCHAR(100)|NN|DP|Tipo de química aplicada (por exemplo, coloração, progressiva).',
'data_aplicacao|DATE|NN|DP|Data da aplicação.',
'formula_aplicada|TEXT|NULL|DP|Fórmula utilizada no procedimento (RF09).',
'id_atendimento|INT|FK:atendimento.id_atendimento;NULL|N/A|Atendimento do salão que realizou o procedimento, quando aplicável.',
'@restricao_cliente|Guarda alergias e sensibilidades da cliente em registros atômicos (RF01).|Anamnese informada pela cliente|Alerta durante agendamento e atendimento|ADM: C,R,U; ATD: C,R,U',
'id_restricao_cliente|INT|PK;AI;NN|N/A|Identificador único da restrição.',
'id_cliente|INT|FK:cliente.id_cliente;NN|N/A|Cliente que possui a restrição.',
'tipo_restricao|ENUM(\'ALERGIA\',\'SENSIBILIDADE\')|NN|DPS|Classifica o registro como alergia ou sensibilidade (dado de saúde).',
'substancia|VARCHAR(100)|NN|DPS|Substância que causa a reação.',
'observacoes|TEXT|NULL|DPS|Detalhes clínicos da reação.',
'data_registro|DATETIME|NN;CUR|N/A|Data e hora do registro.',
'ativo|TINYINT(1)|NN;D1;B01|N/A|Inativação lógica quando a restrição deixa de valer.',
'@perfil_acesso|Define os perfis do controle de acesso por papéis, RBAC (RN12).|Configuração feita pelo administrador|usuario|ADM: C,R,U; ATD: sem acesso',
'id_perfil|INT|PK;AI;NN|N/A|Identificador único do perfil.',
'nome_perfil|VARCHAR(50)|UQ;NN|N/A|Nome único do perfil (por exemplo, Administrador, Atendente).',
'ativo|TINYINT(1)|NN;D1;B01|N/A|Perfil inativo não pode ser atribuído a usuários (RN12).',
'@usuario|Operadores e profissionais do sistema, com credencial, perfil e comissão (RF02).|Cadastro feito pelo administrador|agendamento, historico_preco_servico, movimento_estoque, fechamento_caixa, cancelamento_atendimento, estorno_pagamento e log_auditoria|ADM: C,R,U; ATD: R (próprio registro)',
'id_usuario|INT|PK;AI;NN|N/A|Identificador único do usuário.',
'id_perfil|INT|FK:perfil_acesso.id_perfil;NN|N/A|Perfil único e ativo do usuário (RN12).',
'nome|VARCHAR(100)|NN|DP|Nome do operador ou profissional.',
'email|VARCHAR(100)|UQ;NN|DP|E-mail de acesso; único no sistema.',
'senha_hash|VARCHAR(255)|NN|DP|Hash Argon2id gerado na aplicação; nunca se grava senha em texto claro (RNF01).|SIS: C,U; ADM e ATD: sem leitura|Origem: aplicação (hash Argon2id). Destino: autenticação de login.',
'percentual_comissao|DECIMAL(5,2)|NN;Z;!CHECK BETWEEN 0 AND 100|N/A|Percentual de comissão do profissional, de 0 a 100 (RF02).|ADM: C,R,U; ATD: sem acesso',
'ativo|TINYINT(1)|NN;D1;B01|N/A|Inativação lógica do usuário.',
'telefone|VARCHAR(20)|NN|DP|Telefone de contato do profissional (RF02).',
'profissional|TINYINT(1)|NN;D0;B01|N/A|1 = profissional que executa serviços; 0 = operador administrativo.',
'=Bloco 2: Catálogo e estoque',
'@servico|Catálogo de serviços oferecidos, com preço vigente e duração estimada (RF03).|Cadastro feito pelo administrador|agendamento, servico_insumo e historico_preco_servico|ADM: C,R,U; ATD: R (sem alterar preço, RF13)',
'id_servico|INT|PK;AI;NN|N/A|Identificador único do serviço.',
'nome|VARCHAR(100)|NN|N/A|Nome comercial do serviço.',
'descricao|TEXT|NULL|N/A|Descrição opcional do serviço.',
'duracao_minutos|INT|NN;G0|N/A|Duração estimada em minutos, maior que zero; base do cálculo da hora_fim (RN03).',
'preco_atual|DECIMAL(10,2)|NN;G0|N/A|Preço vigente, maior que zero; alterações geram histórico (RN09).',
'ativo|TINYINT(1)|NN;D1;B01|N/A|Inativação lógica; serviço inativo não pode ser agendado (RN13).',
'@historico_preco_servico|Rastreia as alterações de preço dos serviços sem alterar valores já cobrados (RF15, RN09).|Gerado ao alterar servico.preco_atual|Auditoria e relatórios de rentabilidade|ADM: R; SIS: C; ATD: sem acesso',
'id_historico|INT|PK;AI;NN|N/A|Identificador único do registro de histórico.',
'id_servico|INT|FK:servico.id_servico;NN|N/A|Serviço cujo preço foi alterado.',
'preco_anterior|DECIMAL(10,2)|NN;G0|N/A|Preço vigente antes da alteração.',
'preco_novo|DECIMAL(10,2)|NN;G0|N/A|Preço vigente após a alteração.',
'data_alteracao|TIMESTAMP|NN;CUR|N/A|Momento da alteração.',
'id_usuario|INT|FK:usuario.id_usuario;NN|N/A|Usuário autor da alteração.',
'@produto|Cadastro de produtos e insumos com saldo, estoque mínimo e custo.|Cadastro pelo administrador; saldo atualizado por movimento_estoque|servico_insumo, atendimento_insumo, movimento_estoque; alerta de estoque mínimo|ADM: C,R,U; ATD: R',
'id_produto|INT|PK;AI;NN|N/A|Identificador único do produto.',
'nome|VARCHAR(100)|NN|N/A|Nome do produto ou insumo.',
'quantidade_estoque|DECIMAL(10,3)|NN;Z3;GE|N/A|Saldo atual em estoque; nunca pode ser negativo (RN06).',
'unidade_medida|VARCHAR(10)|NN|N/A|Unidade de medida (por exemplo, ml, g, un).',
'estoque_minimo|DECIMAL(10,3)|NN;Z3;GE|N/A|Nível mínimo que dispara alerta de reposição.',
'ativo|TINYINT(1)|NN;D1;B01|N/A|Inativação lógica; produto inativo não pode ser utilizado (RN13).',
'custo_unitario_atual|DECIMAL(10,4)|NN;GE|N/A|Custo unitário vigente (RF12); copiado como snapshot em atendimento_insumo.',
'@servico_insumo|Tabela associativa N:N que define a receita de insumos de cada serviço (RF03).|Cadastro feito pelo administrador|Baixa automática de estoque na conclusão do atendimento (RN07)|ADM: C,R,U; ATD: R',
'id_servico|INT|PK;FK:servico.id_servico;NN|N/A|Parte da chave primária composta; serviço da receita.',
'id_produto|INT|PK;FK:produto.id_produto;NN|N/A|Parte da chave primária composta; insumo utilizado.',
'quantidade_utilizada|DECIMAL(10,3)|NN;G0|N/A|Quantidade padrão consumida por execução do serviço.',
'@atendimento_insumo|Registra o consumo efetivo e o custo histórico de insumos por atendimento (RN07).|Sistema, na conclusão do atendimento|Cálculo de custo e relatórios RF12|ADM: R; SIS: C; ATD: R',
'id_atendimento|INT|PK;FK:atendimento.id_atendimento;NN|N/A|Parte da chave primária composta; atendimento consumidor.',
'id_produto|INT|PK;FK:produto.id_produto;NN|N/A|Parte da chave primária composta; insumo consumido.',
'quantidade_consumida|DECIMAL(10,3)|NN;G0|N/A|Snapshot da quantidade consumida no atendimento.',
'custo_unitario|DECIMAL(10,4)|NN;GE|N/A|Snapshot do custo unitário na data do consumo.',
'@movimento_estoque|Registra entradas, baixas, estornos e ajustes de estoque com rastreabilidade.|Sistema (baixas e estornos) e administrador (entradas e ajustes)|produto.quantidade_estoque; auditoria de estoque|ADM: C,R; SIS: C; ATD: R',
'id_movimento_estoque|BIGINT|PK;AI;NN|N/A|Identificador único da movimentação.',
'id_produto|INT|FK:produto.id_produto;NN|N/A|Produto movimentado.',
'id_atendimento|INT|FK:atendimento.id_atendimento;NULL;!CHECK obrigatório em CONSUMO|N/A|Atendimento que originou a baixa; obrigatório em CONSUMO.',
'id_cancelamento_atendimento|INT|FK:cancelamento_atendimento.id_cancelamento_atendimento;NULL;!CHECK obrigatório em ESTORNO|N/A|Cancelamento que justifica o estorno; obrigatório em ESTORNO.',
'id_movimento_origem|BIGINT|FK:movimento_estoque.id_movimento_estoque;UQ;NULL|N/A|Baixa que está sendo estornada; cada baixa só pode ser estornada uma vez.',
'tipo_movimento|ENUM(\'ENTRADA\',\'CONSUMO\',\'ESTORNO\',\'AJUSTE_ENTRADA\',\'AJUSTE_SAIDA\')|NN|N/A|Tipo da movimentação; define o sinal aplicado ao saldo.',
'quantidade|DECIMAL(10,3)|NN;G0|N/A|Quantidade positiva movimentada.',
'motivo|TEXT|NULL;!CHECK obrigatório em ajustes|N/A|Justificativa; obrigatória para ajustes de entrada e de saída.',
'data_movimento|DATETIME|NN;CUR|N/A|Data e hora da movimentação.',
'id_usuario|INT|FK:usuario.id_usuario;NN|N/A|Usuário responsável pela movimentação.',
'=Bloco 3: Agenda, execução e financeiro',
'@fechamento_caixa|Marco persistente de fechamento diário; passa a bloquear alterações históricas (RF10, PR04).|Administrador, ao encerrar o dia|atendimento, pagamento, despesa e estorno_pagamento|ADM: C,R; ATD: R',
'id_fechamento_caixa|INT|PK;AI;NN|N/A|Identificador único do fechamento.',
'data_referencia|DATE|UQ;NN|N/A|Dia encerrado; existe um fechamento por dia para o salão.',
'data_fechamento|DATETIME|NN;CUR|N/A|Momento em que o fechamento foi efetuado.',
'id_usuario|INT|FK:usuario.id_usuario;NN|N/A|Administrador responsável.',
'@agendamento|Reservas de horário, com cliente, profissional e serviço (RF04).|Atendente ou administrador, na reserva|atendimento; consultas de agenda RF05; auditoria RF07|ADM: C,R,U; ATD: C,R,U',
'id_agendamento|INT|PK;AI;NN|N/A|Identificador único do agendamento.',
'id_cliente|INT|FK:cliente.id_cliente;NN|N/A|Cliente ativa que solicitou a reserva (RN04, RN13).',
'id_servico|INT|FK:servico.id_servico;NN|N/A|Serviço reservado.',
'id_usuario|INT|FK:usuario.id_usuario;NN|N/A|Profissional responsável pela execução.',
'data_agendamento|DATE|NN|N/A|Data da reserva.',
'hora_inicio|TIME|NN|N/A|Hora de início da reserva.',
'hora_fim|TIME|NN;!CHECK hora_fim > hora_inicio|N/A|Hora de término, calculada na reserva a partir da duração do serviço (RN02).',
'status|ENUM(\'AGENDADO\',\'REALIZADO\',\'CANCELADO\')|NN;!DEFAULT \'AGENDADO\'|N/A|Situação do agendamento; transições AGENDADO para REALIZADO ou CANCELADO (RN05).',
'@atendimento|Execução efetiva do serviço, com valor histórico e comissão aplicada (RF08).|Atendente ou administrador, a partir do agendamento|pagamento, atendimento_insumo, movimento_estoque, cancelamento_atendimento; relatórios|ADM: C,R; ATD: C,R (sem alterar após fechamento, PR04)',
'id_atendimento|INT|PK;AI;NN|N/A|Identificador único do atendimento.',
'id_agendamento|INT|FK:agendamento.id_agendamento;UQ;NN|N/A|Agendamento executado; no máximo um atendimento por agendamento.',
'data_realizacao|DATETIME|NN;CUR|N/A|Data e hora efetivas da execução.',
'valor_cobrado|DECIMAL(10,2)|NN;G0|N/A|Valor histórico fixado na execução; não muda se o preço do serviço mudar (RN09).',
'observacoes|TEXT|NULL|DP|Anotações técnicas da execução; texto livre pode identificar a cliente.',
'percentual_comissao_aplicado|DECIMAL(5,2)|NN;!CHECK BETWEEN 0 AND 100|N/A|Snapshot do percentual de comissão do profissional na data (RF11).',
'id_fechamento_caixa|INT|FK:fechamento_caixa.id_fechamento_caixa;NULL|N/A|Fechamento que consolidou o atendimento; o vínculo bloqueia alterações (PR04).',
'@pagamento|Recebimentos financeiros de um atendimento, inclusive pagamentos fracionados (RF10).|Atendente ou administrador, no caixa|fechamento_caixa, estorno_pagamento e vw_atendimento_liquido|ADM: C,R; ATD: C,R',
'id_pagamento|INT|PK;AI;NN|N/A|Identificador único do pagamento.',
'id_atendimento|INT|FK:atendimento.id_atendimento;NN|N/A|Atendimento pago.',
'valor_pago|DECIMAL(10,2)|NN;G0|N/A|Valor recebido, maior que zero (RN08).',
'valor_desconto|DECIMAL(10,2)|NN;Z;GE|N/A|Parcela do desconto total do atendimento; zero quando não há desconto.',
'forma_pagamento|ENUM(\'DINHEIRO\',\'DEBITO\',\'CREDITO\',\'PIX\')|NN|N/A|Modalidade do recebimento (RN08).',
'data_pagamento|DATETIME|NN;CUR|N/A|Data e hora do recebimento.',
'id_fechamento_caixa|INT|FK:fechamento_caixa.id_fechamento_caixa;NULL|N/A|Fechamento que consolidou o recebimento (PR04).',
'@categoria_despesa|Classifica as despesas operacionais do salão.|Cadastro feito pelo administrador|despesa|ADM: C,R,U; ATD: sem acesso',
'id_categoria_despesa|INT|PK;AI;NN|N/A|Identificador único da categoria.',
'nome_categoria|VARCHAR(50)|UQ;NN|N/A|Nome único da categoria (por exemplo, aluguel, energia).',
'ativo|TINYINT(1)|NN;D1;B01|N/A|Inativação lógica da categoria.',
'@despesa|Saídas financeiras operacionais categorizadas (RF16).|Administrador, no lançamento e na liquidação|fechamento_caixa; apuração de saldo (RN11)|ADM: C,R,U; ATD: sem acesso (RF13)',
'id_despesa|INT|PK;AI;NN|N/A|Identificador único da despesa.',
'id_categoria_despesa|INT|FK:categoria_despesa.id_categoria_despesa;NN|N/A|Categoria da despesa (RN10).',
'descricao|VARCHAR(255)|NN|N/A|Descrição da despesa.',
'valor|DECIMAL(10,2)|NN;G0|N/A|Valor estritamente positivo (RN10).',
'data_vencimento|DATE|NN|N/A|Data de vencimento.',
'data_pagamento|DATE|NULL|N/A|Data da liquidação; nula enquanto a despesa estiver em aberto.',
'id_fechamento_caixa|INT|FK:fechamento_caixa.id_fechamento_caixa;NULL|N/A|Fechamento que consolidou a despesa liquidada.',
'@cancelamento_atendimento|Cancela uma execução sem excluir o histórico (RN07).|Administrador, com motivo obrigatório|movimento_estoque (estorno) e estorno_pagamento|ADM: C,R; ATD: sem acesso',
'id_cancelamento_atendimento|INT|PK;AI;NN|N/A|Identificador único do cancelamento.',
'id_atendimento|INT|FK:atendimento.id_atendimento;UQ;NN|N/A|Atendimento cancelado; no máximo um cancelamento por atendimento.',
'data_cancelamento|DATETIME|NN;CUR|N/A|Data e hora do cancelamento.',
'motivo|TEXT|NN|N/A|Justificativa obrigatória do cancelamento.',
'id_usuario|INT|FK:usuario.id_usuario;NN|N/A|Administrador que autorizou o cancelamento.',
'@estorno_pagamento|Registra devoluções financeiras preservando o pagamento original.|Administrador, após o cancelamento do atendimento|fechamento_caixa|ADM: C,R; ATD: sem acesso',
'id_estorno_pagamento|INT|PK;AI;NN|N/A|Identificador único do estorno.',
'id_pagamento|INT|FK:pagamento.id_pagamento;NN|N/A|Pagamento que recebe a devolução.',
'id_cancelamento_atendimento|INT|FK:cancelamento_atendimento.id_cancelamento_atendimento;NN|N/A|Cancelamento que justifica a devolução.',
'valor_estornado|DECIMAL(10,2)|NN;G0|N/A|Valor devolvido; a soma dos estornos não pode exceder o valor_pago.',
'data_estorno|DATETIME|NN;CUR|N/A|Data e hora da devolução.',
'motivo|TEXT|NN|N/A|Justificativa obrigatória do estorno.',
'id_usuario|INT|FK:usuario.id_usuario;NN|N/A|Usuário responsável pela devolução.',
'id_fechamento_caixa|INT|FK:fechamento_caixa.id_fechamento_caixa;NULL|N/A|Fechamento que consolidou a devolução.',
'=Bloco 4: Auditoria e visão derivada',
'@log_auditoria|Trilha de auditoria imutável (append-only) das operações críticas (RNF07).|Sistema, por gatilhos ou pela aplicação|Auditoria e conformidade|ADM: R; SIS: C; ATD: sem acesso',
'id_log|BIGINT|PK;AI;NN|N/A|Identificador único do registro de auditoria.',
'tabela_afetada|VARCHAR(50)|NN|N/A|Nome da tabela onde ocorreu a operação.',
'id_registro_afetado|INT|NN|N/A|Identificador do registro afetado (identificador legado de chave simples).',
'operacao|ENUM(\'INSERT\',\'UPDATE\',\'DELETE\')|NN|N/A|Tipo da operação auditada.',
'valor_anterior|JSON|NULL|DP|Estado do registro antes da operação; pode conter dados pessoais.',
'valor_novo|JSON|NULL|DP|Estado do registro depois da operação; pode conter dados pessoais.',
'id_usuario|INT|FK:usuario.id_usuario;NN|N/A|Usuário que executou a operação.',
'data_hora|TIMESTAMP|NN;CUR|N/A|Momento da operação.',
'chave_registro|JSON|NN|N/A|Chave do registro afetado; cobre chaves compostas e BIGINT.',
'motivo|TEXT|NULL|N/A|Justificativa; obrigatória em alterações de agenda (RF07).',
'@vw_atendimento_liquido|Visão que deriva o valor líquido do atendimento (valor cobrado menos descontos). Não é persistido em tabela (RN11).|Derivada de atendimento e pagamento|Consultas financeiras RF10 e RF11|ADM: R; ATD: R',
'id_atendimento|INT|VIEW|N/A|Chave do atendimento.',
'valor_cobrado|DECIMAL(10,2)|VIEW|N/A|Valor histórico cobrado no atendimento.',
'total_descontos|DECIMAL (derivado)|VIEW|N/A|COALESCE(SUM(valor_desconto), 0) dos pagamentos do atendimento.',
'valor_liquido|DECIMAL (derivado)|VIEW|N/A|valor_cobrado menos total_descontos.'
  ];

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ---------- Interpretação dos dados ---------- */
  var groups = [], cur = null, tbl = null;
  DD.forEach(function (line) {
    if (line.charAt(0) === '=') {
      cur = { title: line.slice(1), tables: [] };
      groups.push(cur);
    } else if (line.charAt(0) === '@') {
      var p = line.slice(1).split('|');
      tbl = { name: p[0], fin: p[1], org: p[2], dst: p[3], rbac: p[4], cols: [] };
      cur.tables.push(tbl);
    } else {
      var c = line.split('|');
      tbl.cols.push({ n: c[0], t: c[1], k: c[2], l: c[3], d: c[4], r: c[5], g: c[6] });
    }
  });

  function badge(l) {
    var cls = l === 'DPS' ? 'b-dps' : (l === 'DP' ? 'b-dp' : 'b-na');
    return '<span class="badge ' + cls + '">' + esc(l) + '</span>';
  }

  function cons(k) {
    return k.split(';').map(function (t) {
      if (t === 'PK') return '<b class="c pk">[PK]</b>';
      if (t.indexOf('FK') === 0) {
        return '<b class="c fk">[FK]</b><span class="ref">ref. ' + esc(t.split(':')[1]) + '</span>';
      }
      if (t === 'UQ') return '<b class="c">[UNIQUE]</b>';
      if (t === 'NULL') return '<b class="c">[NULL]</b>';
      if (t === 'NN') return '<b class="c">[NOT NULL]</b>';
      var x = TOK[t] || t.replace(/^!/, '');
      return '<span class="cx">' + esc(x) + '</span>';
    }).join(' ');
  }

  function lineage(t, c) {
    if (c.g) return c.g;
    var fk = /(^|;)FK:([^;]+)/.exec(c.k);
    if (fk) return 'Origem: ' + fk[2] + ' (chave herdada). Destino: ' + t.name + ' e junções de consulta.';
    if (/(^|;)PK(;|$)/.test(c.k)) return 'Origem: gerado pelo SGBD. Destino: chaves estrangeiras que referenciam ' + t.name + '.' + c.n + '.';
    return 'Origem: ' + t.org + '. Destino: ' + t.dst + '.';
  }

  /* ---------- Renderização ---------- */
  var nav = document.getElementById('nav');
  var dict = document.getElementById('dict');
  var navHtml = '<a href="#identificacao">Identificação</a>';
  var dictHtml = '', totalT = 0, totalC = 0;

  groups.forEach(function (g) {
    navHtml += '<h4>' + esc(g.title) + '</h4>';
    g.tables.forEach(function (t) {
      var isView = t.name.indexOf('vw_') === 0;
      totalT++; totalC += t.cols.length;
      navHtml += '<a href="#tabela_' + t.name + '" data-t="' + t.name + '">' + t.name + '</a>';
      dictHtml += '<section class="card tbl" id="tabela_' + t.name + '" data-t="' + t.name + '">' +
        '<h3>' + t.name + '<span class="tag">' + (isView ? 'visão' : 'tabela') + ' - ' + t.cols.length + ' colunas</span></h3>' +
        '<p class="fin">' + esc(t.fin) + '</p>' +
        '<p class="meta"><b>Linhagem da tabela:</b> origem: ' + esc(t.org) + '; destino: ' + esc(t.dst) + '. <b>RBAC da tabela:</b> ' + esc(t.rbac) + '.</p>' +
        '<div class="tw"><table><thead><tr><th>Atributo</th><th>Descrição / Regra de Negócio</th><th>Tipo e Tamanho</th><th>Constraints</th><th>Privacidade (LGPD)</th><th>Linhagem (Data Lineage)</th><th>Controle de Acesso (RBAC)</th></tr></thead><tbody>';
      t.cols.forEach(function (c) {
        dictHtml += '<tr data-c="' + c.n + '"><td class="at">' + c.n + '</td><td>' + esc(c.d) + '</td><td class="ty">' + esc(c.t) + '</td><td>' + cons(c.k) + '</td><td>' + badge(c.l) + '</td><td class="lin">' + esc(lineage(t, c)) + '</td><td>' + esc(c.r || t.rbac) + '</td></tr>';
      });
      dictHtml += '</tbody></table></div></section>';
    });
  });
  nav.innerHTML = navHtml;
  dict.innerHTML = dictHtml;

  document.getElementById('team').innerHTML = TEAM.map(function (m) {
    return '<tr><td>' + esc(m[0]) + '</td><td>' + esc(m[1]) + '</td></tr>';
  }).join('');

  /* ---------- Busca em tempo real ---------- */
  var search = document.getElementById('search');
  var count = document.getElementById('count');
  var empty = document.getElementById('empty');
  var sections = [].slice.call(dict.querySelectorAll('section.tbl'));
  var navLinks = [].slice.call(nav.querySelectorAll('a[data-t]'));
  var navHeads = [].slice.call(nav.querySelectorAll('h4'));

  function filter() {
    var q = search.value.trim().toLowerCase(), vt = 0, vc = 0;
    sections.forEach(function (s) {
      var tm = !q || s.getAttribute('data-t').toLowerCase().indexOf(q) > -1, shown = 0;
      [].forEach.call(s.querySelectorAll('tbody tr'), function (r) {
        var ok = tm || r.getAttribute('data-c').toLowerCase().indexOf(q) > -1;
        r.hidden = !ok;
        if (ok) shown++;
      });
      s.hidden = shown === 0;
      if (shown) { vt++; vc += shown; }
    });
    navLinks.forEach(function (a) {
      var s = document.getElementById('tabela_' + a.getAttribute('data-t'));
      a.hidden = s.hidden;
    });
    navHeads.forEach(function (h) {
      var n = h.nextElementSibling, any = false;
      while (n && n.tagName === 'A') { if (!n.hidden) any = true; n = n.nextElementSibling; }
      h.hidden = !any;
    });
    empty.hidden = vt !== 0;
    count.textContent = vt + ' de ' + totalT + ' tabelas e visões e ' + vc + ' de ' + totalC + ' colunas exibidas.';
  }
  search.addEventListener('input', filter);
  filter();

  /* ---------- Menu lateral (celular) ---------- */
  var menuBtn = document.getElementById('menuBtn');
  function setNav(open) {
    document.body.classList.toggle('nav-open', open);
    menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  }
  menuBtn.addEventListener('click', function () { setNav(!document.body.classList.contains('nav-open')); });
  nav.addEventListener('click', function (e) { if (e.target.tagName === 'A') setNav(false); });

  /* ---------- Destaque do item ativo na sidebar ---------- */
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          navLinks.forEach(function (a) {
            a.classList.toggle('active', 'tabela_' + a.getAttribute('data-t') === en.target.id);
          });
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  /* ---------- Tema claro/escuro ---------- */
  var root = document.documentElement, themeBtn = document.getElementById('themeBtn');
  function applyTheme(t) {
    root.setAttribute('data-theme', t);
    themeBtn.textContent = t === 'dark' ? 'Modo claro' : 'Modo escuro';
  }
  var saved = null;
  try { saved = localStorage.getItem('dd-theme'); } catch (e) { saved = null; }
  if (!saved && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) saved = 'dark';
  applyTheme(saved || 'light');
  themeBtn.addEventListener('click', function () {
    var t = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(t);
    try { localStorage.setItem('dd-theme', t); } catch (e) { /* armazenamento indisponível */ }
  });

  /* ---------- Modal do DER com Panzoom ---------- */
  var modal = document.getElementById('derModal');
  var view = document.getElementById('derView');
  var img = document.getElementById('derImg');
  var msg = document.getElementById('derMsg');
  var pz = null;

  function ensurePanzoom() {
    if (pz) return true;
    if (typeof Panzoom === 'undefined') {
      msg.textContent = 'A biblioteca de zoom não carregou (verifique a conexão). A imagem continua visível, sem zoom.';
      return false;
    }
    pz = Panzoom(img, { maxScale: 12, minScale: 0.3, canvas: true });
    view.addEventListener('wheel', pz.zoomWithWheel);
    return true;
  }
  function openDer() {
    modal.hidden = false;
    document.body.classList.add('noscroll');
    if (ensurePanzoom()) pz.reset({ animate: false });
    document.getElementById('derClose').focus();
  }
  function closeDer() {
    modal.hidden = true;
    document.body.classList.remove('noscroll');
    document.getElementById('derBtn').focus();
  }
  var derSrcs = ['assets/der.png', 'der.png', 'assets/der.jpg', 'der.jpg'], derIdx = 0;
  function derFail() {
    derIdx++;
    if (derIdx < derSrcs.length) { img.src = derSrcs[derIdx]; }
    else { msg.textContent = 'Imagem do DER não encontrada. Coloque o arquivo em assets/der.png (mesma pasta do index.html).'; }
  }
  img.addEventListener('error', derFail);
  img.addEventListener('load', function () { msg.textContent = ''; });
  if (img.complete && img.naturalWidth === 0) derFail();

  /* Download da Especificação: tenta docs/ e depois a pasta atual */
  var pdfLink = document.getElementById('pdfBtn');
  var pdfList = ['docs/Especificacao_Requisitos_Regras_Negocio_BD.pdf', 'Especificacao_Requisitos_Regras_Negocio_BD.pdf'];
  function goPdf(url) {
    var a = document.createElement('a');
    a.href = url; a.download = 'Especificacao_Requisitos_Regras_Negocio_BD.pdf';
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  pdfLink.addEventListener('click', function (e) {
    if (!window.fetch || location.protocol === 'file:') return;
    e.preventDefault();
    (function tryNext(i) {
      if (i >= pdfList.length) { alert('PDF não encontrado. Coloque o arquivo em docs/Especificacao_Requisitos_Regras_Negocio_BD.pdf.'); return; }
      fetch(pdfList[i], { method: 'HEAD' }).then(function (r) {
        if (r.ok) goPdf(pdfList[i]); else tryNext(i + 1);
      }).catch(function () { tryNext(i + 1); });
    })(0);
  });
  document.getElementById('derBtn').addEventListener('click', openDer);
  document.getElementById('derClose').addEventListener('click', closeDer);
  document.getElementById('zIn').addEventListener('click', function () { if (pz) pz.zoomIn(); });
  document.getElementById('zOut').addEventListener('click', function () { if (pz) pz.zoomOut(); });
  document.getElementById('zReset').addEventListener('click', function () { if (pz) pz.reset(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !modal.hidden) closeDer();
  });
})();
