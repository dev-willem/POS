const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const readSvg = (name) => fs.readFileSync(path.join(root, 'diagramas', name), 'utf8');

const svgCasosDeUso = readSvg('casos_de_uso.svg');
const svgDer = readSvg('der.svg');

const integrantes = [
  'Allyfh Fernando da Silva Pontes',
  'Álvaro Antônio Oliveira de Medeiros',
  'Diego de Andrade dos Santos Silva',
  'Douglas Pierry Damasceno da Silva',
  "Ryann Deyv's Araújo Costa",
  'Willemberg Lopes de Mendonça Filho',
];

const requisitos = [
  ['RF01', 'Cadastrar corrida', 'O sistema deve permitir que um responsável cadastre uma corrida, informando seus dados e os checkpoints que compõem o percurso.'],
  ['RF02', 'Cadastrar checkpoint', 'O sistema deve permitir cadastrar os checkpoints de uma corrida, informando o número de identificação do checkpoint (usado também no local físico da prova) e o professor responsável por ele.'],
  ['RF03', 'Cadastrar equipe', 'O sistema deve permitir cadastrar previamente as equipes participantes, informando sua identificação.'],
  ['RF04', 'Registrar passagem de equipe em checkpoint', 'O sistema deve permitir que o professor responsável pelo checkpoint registre a passagem de uma equipe, informando a corrida, o checkpoint e a equipe, armazenando automaticamente o momento (data/hora) do registro.'],
  ['RF05', 'Consultar corrida', 'O sistema deve permitir consultar uma corrida, visualizando seus checkpoints e as passagens já registradas pelas equipes, com atualização em tempo real durante a prova.'],
  ['RF06', 'Consultar histórico de equipe', 'O sistema deve permitir consultar o histórico de uma equipe, identificando os checkpoints já percorridos por ela e os respectivos horários de passagem.'],
];

const rnfs = [
  ['RNF01', 'Consistência dos registros', 'O sistema deve garantir que cada passagem registrada esteja corretamente associada à corrida, ao checkpoint e à equipe correspondentes, de modo que os registros de uma corrida não sejam confundidos com os de outra competição realizada pela escola.'],
  ['RNF02', 'Disponibilidade em tempo real', 'O sistema deve permitir a consulta das passagens registradas durante a realização da prova, possibilitando o acompanhamento em tempo real da progressão das equipes pelo percurso.'],
];

const telas = [
  {
    n: 'Tela 1', titulo: 'Corridas cadastradas', rf: 'RF01, RF05',
    desc: 'Ponto de entrada do sistema: lista as corridas já cadastradas, permite iniciar o cadastro de uma nova corrida e acessar a consulta de uma corrida existente.',
    img: '01-corridas.png',
  },
  {
    n: 'Tela 2', titulo: 'Cadastrar corrida', rf: 'RF01, RF02',
    desc: 'Formulário para registrar os dados da corrida e, na mesma tela, os checkpoints que fazem parte do percurso — cada um com seu número identificador e o professor responsável.',
    img: '02-cadastrar-corrida.png',
  },
  {
    n: 'Tela 3', titulo: 'Cadastrar equipe', rf: 'RF03',
    desc: 'Cadastro prévio das equipes participantes, exibindo também a lista de equipes já registradas, com acesso ao histórico de cada uma.',
    img: '03-cadastrar-equipe.png',
  },
  {
    n: 'Tela 4', titulo: 'Registrar passagem', rf: 'RF04',
    desc: 'Tela utilizada pelo professor responsável no checkpoint durante a corrida: o contexto (corrida, checkpoint e professor) já está definido, restando apenas selecionar a equipe que chegou para registrar sua passagem, com o horário gravado automaticamente.',
    img: '04-registrar-passagem.png',
  },
  {
    n: 'Tela 5', titulo: 'Consultar corrida', rf: 'RF05',
    desc: 'Visão consolidada de uma corrida: checkpoints do percurso, progressão das equipes (quais checkpoints cada equipe já alcançou e quais ainda não) e a lista de passagens registradas, atualizada em tempo real.',
    img: '05-consultar-corrida.png',
  },
  {
    n: 'Tela 6', titulo: 'Histórico da equipe', rf: 'RF06',
    desc: 'Histórico de uma equipe específica, organizado por corrida, mostrando os checkpoints já percorridos e os respectivos horários de passagem.',
    img: '06-historico-equipe.png',
  },
];

const rastreabilidade = [
  ['RF01', 'UC01 — Cadastrar corrida', 'Corrida, Checkpoint', 'Tela 2 — Cadastrar corrida'],
  ['RF02', 'UC02 — Cadastrar checkpoint', 'Checkpoint, Professor', 'Tela 2 — Cadastrar corrida'],
  ['RF03', 'UC03 — Cadastrar equipe', 'Equipe', 'Tela 3 — Cadastrar equipe'],
  ['RF04', 'UC04 — Registrar passagem de equipe em checkpoint', 'Passagem, Corrida, Checkpoint, Equipe', 'Tela 4 — Registrar passagem'],
  ['RF05', 'UC05 — Consultar corrida', 'Corrida, Checkpoint, Passagem', 'Tela 1 e Tela 5'],
  ['RF06', 'UC06 — Consultar histórico de equipe', 'Equipe, Passagem', 'Tela 6 — Histórico da equipe'],
];

const rowsHtml = (rows) => rows.map(([c, t, d]) => `
        <tr>
          <td class="codigo-rf">${c}</td>
          <td>${t}</td>
          <td>${d}</td>
        </tr>`).join('');

const rastreabilidadeHtml = rastreabilidade.map(([rf, uc, ent, tela]) => `
        <tr>
          <td class="codigo-rf">${rf}</td>
          <td>${uc}</td>
          <td>${ent}</td>
          <td>${tela}</td>
        </tr>`).join('');

const integrantesHtml = integrantes.map(n => `<li>${n}</li>`).join('\n          ');

const telasHtml = telas.map(t => `
    <section class="folha tela-proto">
      <div class="rotulo-tela">${t.n} &middot; RF relacionado(s): ${t.rf}</div>
      <h3>${t.titulo}</h3>
      <p class="desc-tela">${t.desc}</p>
      <div class="moldura-print">
        <img src="screenshots/${t.img}" alt="${t.titulo}">
      </div>
    </section>`).join('\n');

const html = `<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<title>Atividade 1 — Controle de Checkpoints em Corridas de Trekking</title>
<style>
  @page { size: A4; margin: 18mm 18mm; }

  * { box-sizing: border-box; }

  body {
    font-family: "Segoe UI", Arial, Helvetica, sans-serif;
    color: #262922;
    font-size: 13.5px;
    line-height: 1.55;
    margin: 0;
  }

  h1, h2, h3 { color: #164F35; }
  h2 { font-size: 19px; border-bottom: 2px solid #1F6F4A; padding-bottom: 6px; margin-top: 0; }
  h3 { font-size: 15px; margin-bottom: 4px; }

  section.folha { page-break-before: always; }
  section.folha:first-of-type { page-break-before: auto; }

  /* ---------- Capa ---------- */
  .capa {
    height: 250mm;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    text-align: center;
  }
  .capa .topo { margin-top: 10mm; font-size: 13px; color: #6B6F63; }
  .capa .meio { margin-top: 30mm; }
  .capa .meio .estudo-caso { font-size: 13px; color: #9A4E12; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; margin-bottom: 14px; }
  .capa .meio h1 { font-size: 26px; margin: 0 0 10px; }
  .capa .meio .subt { font-size: 14px; color: #6B6F63; }
  .capa .integrantes { text-align: left; max-width: 380px; margin: 0 auto; }
  .capa .integrantes h4 { font-size: 12.5px; text-transform: uppercase; letter-spacing: 0.5px; color: #6B6F63; margin-bottom: 8px; text-align: center; }
  .capa .integrantes ul { list-style: none; padding: 0; margin: 0; font-size: 13.5px; }
  .capa .integrantes li { padding: 3px 0; text-align: center; }
  .capa .rodape { font-size: 12px; color: #6B6F63; margin-bottom: 6mm; }

  /* ---------- Conteudo geral ---------- */
  .intro p { text-align: justify; }

  table.tabela-req { width: 100%; border-collapse: collapse; font-size: 12.5px; margin-top: 14px; }
  table.tabela-req th { background: #E7F1EC; color: #164F35; text-align: left; padding: 8px 10px; border: 1px solid #C9DED2; }
  table.tabela-req td { padding: 8px 10px; border: 1px solid #E1DDD3; vertical-align: top; }
  table.tabela-req td.codigo-rf { font-weight: 700; color: #164F35; white-space: nowrap; }

  .bloco-rnf { margin-top: 26px; }

  .diagrama-wrap { text-align: center; margin-top: 16px; }
  .diagrama-wrap svg { width: 100%; max-width: 100%; height: auto; }

  .atores-lista, .entidades-lista { font-size: 13px; margin-top: 14px; }
  .atores-lista li, .entidades-lista li { margin-bottom: 6px; }

  .nota { background: #FBEADC; border: 1px solid #EFCBA3; border-radius: 6px; padding: 10px 14px; font-size: 12px; color: #7A3D0E; margin-top: 16px; }

  /* ---------- Prototipo ---------- */
  .tela-proto .rotulo-tela { font-size: 11px; text-transform: uppercase; letter-spacing: 0.4px; color: #9A4E12; font-weight: 700; margin-bottom: 4px; }
  .tela-proto .desc-tela { color: #444; margin-top: 4px; margin-bottom: 14px; text-align: justify; }
  .moldura-print { border: 1px solid #E1DDD3; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }
  .moldura-print img { width: 100%; display: block; }

  footer.pe-pagina { position: fixed; bottom: 8mm; left: 18mm; right: 18mm; font-size: 10px; color: #999; text-align: center; }
</style>
</head>
<body>

  <!-- ============ CAPA ============ -->
  <section class="folha capa">
    <div class="topo">
      Instituto Federal de Educação, Ciência e Tecnologia do Rio Grande do Norte (IFRN) — Campus Zona Norte<br>
      Disciplina: Programação Orientada a Serviços
    </div>
    <div class="meio">
      <div class="estudo-caso">Estudo de Caso 3 — Controle de Checkpoints em Corridas de Trekking</div>
      <h1>Sistema de Controle de Checkpoints<br>em Corridas de Trekking</h1>
      <p class="subt">Atividade 1 — Análise, Modelagem e Prototipação do Sistema</p>
    </div>
    <div class="integrantes">
      <h4>Integrantes</h4>
      <ul>
          ${integrantesHtml}
      </ul>
    </div>
    <div class="rodape">Escola Caminhos da Aventura &middot; 2026</div>
  </section>

  <!-- ============ 1. INTRODUCAO ============ -->
  <section class="folha intro">
    <h2>1. Introdução</h2>
    <p>
      A Escola Caminhos da Aventura pretende realizar competições de corrida de aventura no estilo trekking,
      nas quais equipes de competidores percorrem um trajeto definido, passando por diversos pontos de controle
      (checkpoints) espalhados ao longo do percurso. Por não possuir recursos para instalar totens eletrônicos
      de registro automático em todos os checkpoints, a escola decidiu adotar um sistema informatizado operado
      pelos professores responsáveis por cada ponto de controle, que registram manualmente a passagem de cada
      equipe.
    </p>
    <p>
      Antes de uma competição, um responsável cadastra a corrida, define os checkpoints que compõem o percurso
      (cada um identificado por uma numeração e associado a um professor responsável) e cadastra previamente as
      equipes participantes. Durante a prova, ao chegar a um checkpoint, o professor responsável registra a
      passagem da equipe, informando a corrida, o checkpoint e a equipe — o sistema grava automaticamente o
      horário do registro. Como esses registros são feitos em tempo real, a organização pode acompanhar a
      progressão das equipes enquanto a prova acontece, verificando quais checkpoints já foram alcançados por
      cada equipe, além de consultar posteriormente o histórico de passagens de uma equipe específica.
    </p>
    <p>
      O objetivo desta atividade não é implementar o sistema, mas compreender o problema descrito no estudo de
      caso e representar uma primeira especificação da solução por meio de quatro artefatos coerentes entre si:
      a tabela de requisitos, o diagrama de casos de uso, o diagrama entidade-relacionamento (DER) e o protótipo
      visual das principais telas, apresentados nas seções seguintes.
    </p>
  </section>

  <!-- ============ 2. REQUISITOS ============ -->
  <section class="folha">
    <h2>2. Requisitos do Sistema</h2>
    <p>Os requisitos abaixo foram derivados diretamente da descrição do estudo de caso.</p>

    <h3>2.1 Requisitos Funcionais</h3>
    <table class="tabela-req">
      <thead><tr><th style="width:60px;">Código</th><th style="width:230px;">Requisito</th><th>Descrição</th></tr></thead>
      <tbody>${rowsHtml(requisitos)}
      </tbody>
    </table>

    <div class="bloco-rnf">
      <h3>2.2 Requisitos Não Funcionais</h3>
      <table class="tabela-req">
        <thead><tr><th style="width:60px;">Código</th><th style="width:230px;">Requisito</th><th>Descrição</th></tr></thead>
        <tbody>${rowsHtml(rnfs)}
        </tbody>
      </table>
    </div>
  </section>

  <!-- ============ 3. CASOS DE USO ============ -->
  <section class="folha">
    <h2>3. Diagrama de Casos de Uso</h2>
    <p>
      O sistema é utilizado por dois perfis de usuário. O <strong>Responsável</strong> (organizador da corrida)
      cadastra as corridas, os checkpoints do percurso e as equipes participantes, além de consultar o andamento
      das corridas e o histórico das equipes. O <strong>Professor</strong> responsável por um checkpoint utiliza
      o sistema durante a prova para registrar a passagem das equipes por aquele ponto de controle.
    </p>
    <ul class="atores-lista">
      <li><strong>Responsável (organizador):</strong> UC01 Cadastrar corrida, UC02 Cadastrar checkpoint, UC03 Cadastrar equipe, UC05 Consultar corrida, UC06 Consultar histórico de equipe.</li>
      <li><strong>Professor (responsável pelo checkpoint):</strong> UC04 Registrar passagem de equipe em checkpoint.</li>
    </ul>
    <p style="font-size:12.5px; color:#555;">
      O caso de uso <em>UC01 — Cadastrar corrida</em> inclui (<code>«include»</code>) o caso de uso
      <em>UC02 — Cadastrar checkpoint</em>, pois os checkpoints do percurso são definidos como parte do
      cadastro da corrida.
    </p>
    <div class="diagrama-wrap">
      ${svgCasosDeUso}
    </div>
  </section>

  <!-- ============ 4. DER ============ -->
  <section class="folha">
    <h2>4. Diagrama Entidade-Relacionamento (DER)</h2>
    <p>As entidades abaixo representam os dados que o sistema precisa armazenar, de acordo com o estudo de caso:</p>
    <ul class="entidades-lista">
      <li><strong>Corrida</strong> — competição cadastrada pela escola, identificada por um nome.</li>
      <li><strong>Checkpoint</strong> — ponto de controle do percurso de uma corrida, identificado por uma numeração e associado a um professor responsável.</li>
      <li><strong>Professor</strong> — pessoa responsável por um ou mais checkpoints, encarregada de registrar as passagens no local.</li>
      <li><strong>Equipe</strong> — equipe participante, previamente cadastrada no sistema.</li>
      <li><strong>Passagem</strong> — registro da passagem de uma equipe por um checkpoint de uma corrida, contendo o momento (data/hora) em que ocorreu.</li>
    </ul>
    <div class="diagrama-wrap">
      ${svgDer}
    </div>
    <div class="nota">
      A entidade <strong>Passagem</strong> associa Corrida, Checkpoint e Equipe, garantindo que cada registro
      esteja vinculado à corrida correta (RNF01) e permitindo tanto a consulta de uma corrida (RF05) quanto o
      histórico de uma equipe (RF06) a partir da mesma informação.
    </div>
  </section>

  <!-- ============ 5. PROTOTIPO ============ -->
  <section class="folha">
    <h2>5. Protótipo Visual</h2>
    <p>
      O protótipo foi desenvolvido em HTML e CSS (Opção B), representando as principais telas do sistema descrito
      nos requisitos e nos casos de uso. Nenhuma lógica de sistema foi implementada — as telas a seguir são
      capturas do protótipo navegável, com dados de exemplo ilustrativos.
    </p>
  </section>
  ${telasHtml}

  <!-- ============ 6. RASTREABILIDADE ============ -->
  <section class="folha">
    <h2>6. Rastreabilidade entre os Artefatos</h2>
    <p>
      A tabela a seguir demonstra a coerência entre os quatro artefatos produzidos, relacionando cada requisito
      funcional ao respectivo caso de uso, às entidades do DER envolvidas e à tela do protótipo correspondente.
    </p>
    <table class="tabela-req">
      <thead><tr><th style="width:55px;">RF</th><th style="width:230px;">Caso de uso</th><th style="width:190px;">Entidades envolvidas</th><th>Tela do protótipo</th></tr></thead>
      <tbody>${rastreabilidadeHtml}
      </tbody>
    </table>
  </section>

</body>
</html>
`;

fs.writeFileSync(path.join(root, 'relatorio.html'), html, 'utf8');
console.log('relatorio.html gerado');
