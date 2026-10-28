# Dados do gerador

Todos os valores e probabilidades do One Piece Character Generator estão nestes ficheiros CSV (separados por `;`, abrem no Excel).
Para adicionar, alterar ou remover um valor basta editar as linhas. Não é preciso mexer no código.

## Regras comuns

- **weight**: peso relativo de cada linha. A probabilidade de uma linha é o seu peso a dividir pela soma dos pesos das linhas possíveis.
  Ex.: `Human;10` e `Giant;3` com um total de 30 → Human 33%, Giant 10%. Aceita decimais (`0.02` ou `0,02`). Vazio = 1, `0` = nunca sai.
- **chance**: probabilidade direta entre 0 e 1 (`0.3` = 30%).
- **_min / _max**: o valor é sorteado entre os dois, incluídos. A bounty conta em milhões (`5` = 5,000,000).
- **period**: `1` = 1st Year, `2` = After 2 Years, `3` = After 10 Years, `2 & 3` = os dois timeskips. Vazio = todos os períodos.
- **Colunas de condição** (ex.: `alliance`, `race`, `rank`): escolhem o grupo de linhas a sortear. Vazio = qualquer valor.
  As linhas com as mesmas condições formam um grupo, e o gerador usa o **primeiro grupo do ficheiro** que encaixa na personagem.
  Por isso as regras específicas ficam em cima e as gerais (condições vazias) em baixo.
- Níveis de haki (`conquerors`, `armament`, `observation`, `level`): vazio, `Basic`, `Advanced` ou `Master`.
- Sim/não: `Yes` ou vazio.

## Ficheiros

| Ficheiro | O que define |
| --- | --- |
| `settings.csv` | Valores gerais: chance e bónus do Will of D., parte do Doriki do rank nos timeskips, parte do Doriki que vira bounty, limites da bounty dos Pets, Doriki de um rank que não esteja em `ranks.csv`. |
| `names.csv` | Nomes e alcunhas aleatórios. `part` = `first_name`, `last_name`, `nickname_prefix` ou `nickname_suffix`. |
| `genders.csv` | Probabilidade de cada género. `gender` tem de ser igual ao valor da lista do site (`male`, `female`, `other`). |
| `races.csv` | Raças puras: `weight` = probabilidade de cada uma (0 = nunca sai sozinha, só como componente). Doriki no 1st Year, `bounty_min` / `bounty_max` (bounty racial, 0 em todas). `kind` = `Biological`, `Artificial` (componente mecânico, ex.: Machine) ou `Category` (a linha `Hybrid`, que sorteia um híbrido). |
| `hybrids.csv` | Híbridos: os dois componentes (`race_a`, `race_b`, qualquer ordem), `hybrid_name`, `description` (inglês) e `weight` dentro da categoria `Hybrid`. Não tem valores de Doriki nem de bounty: são calculados a partir dos componentes. Tipo `Artificial Hybrid` se um componente for `Artificial`, senão `Hybrid`. |
| `regions.csv` | Região de nascimento, por `alliance` (do 1st Year) e `race`. A linha `Hybrid` vale para todos os híbridos biológicos; as linhas sem raça servem para as outras raças (Human, híbridos artificiais e raças novas). |
| `alliances.csv` | Probabilidade de cada alliance (organização) no 1st Year, bounty que dá e `has_bounty`. `main_alliance` = afiliação principal (`Free`, `Revolutionaries` ou `World Government`), que não tem sorteio próprio: vem da organização. As organizações de `World Government` têm sempre bounty 0 (`has_bounty` = `No`). `ranks_from` / `ranks_exclude` = a alliance usa os ranks (e rank-changes) de outra, menos os excluídos (ex.: Revolutionary Country usa os de World Nobles sem Celestial Dragon), a não ser que tenha linhas próprias. |
| `alliance-changes.csv` | Alliance (organização) em cada timeskip conforme a anterior. A linha da própria alliance é a chance de a manter (ex.: Pirate 12 contra 1+1+1 → 80%). |
| `ranks.csv` | Todos os ranks de cada alliance: `weight` = probabilidade no 1st Year (0 = só aparece nos timeskips), Doriki e bounty do rank, haki mínimo exigido, `timeskip_jump_chance` (chance de saltar para este rank num timeskip, seja qual for o anterior, ex.: Yonko 2%), `bounty_in_thousands` (Pets) e `keeps_higher_bounty` (no After 10 Years mantém a bounty do After 2 Years se a nova for mais baixa). |
| `rank-changes.csv` | Rank em cada timeskip conforme a alliance nova e o rank anterior. As linhas sem `previous_rank` servem para os outros ranks e para quem muda de alliance. |
| `fighting-styles.csv` | Estilo de luta. No 1st Year sorteia do primeiro grupo que encaixa (alliance, rank ou raça). Nos timeskips o estilo mantém-se, a não ser que um grupo desse período (ex.: rank Swordsman) não o permita. |
| `haki-chances.csv` | Que hakis a personagem tem. No 1st Year pode depender do `fighting` e do `rank`; nos timeskips depende do haki anterior (`previous_haki`, `None` = nenhum). O haki mínimo dos ranks é aplicado no fim. |
| `haki-level-chances.csv` | Por período: `start_weight` = probabilidade do nível com que um haki novo começa; `upgrade_chance` = chance de um haki que já tinha subir deste nível para o seguinte. |
| `haki-levels.csv` | Doriki, bounty e descrição de cada nível de cada haki. |
| `devil-fruit-types.csv` | Probabilidade de cada tipo de fruta (`No` = sem fruta), Doriki, bounty e descrição. |
| `devil-fruits.csv` | As frutas de cada tipo e a explicação dos poderes (`power`, opcional). |
| `feats.csv` | Feats de cada alliance (`Any` = todas): probabilidade, Doriki, bounty e haki exigido. As linhas `None` não são sorteadas. |
| `feat-counts.csv` | Probabilidade de ter 1, 2 ou 3 feats por período. |

## Como são feitas as contas

- **Doriki do 1st Year**: raça + rank + haki + devil fruit + feats (+ bónus do Will of D.).
- **Doriki nos timeskips**: Doriki anterior + parte do Doriki do rank (`timeskip_rank_doriki_share`) + haki + feats.
- **Bounty**: parte do Doriki (`doriki_bounty_share`) + alliance + devil fruit + feats + haki + rank + bounty racial. Nas organizações de World Government a bounty é sempre 0.
- **Raça híbrida**: `hybrid = (componente A + componente B) / 2`, para `doriki_min`, `doriki_max`, `bounty_min` e `bounty_max` (arredondado para baixo). É calculada a partir de `races.csv` em cada sorteio, por isso uma alteração na raça atualiza todos os híbridos que a contêm. Uma raça pura usa 100% dos seus valores. O Doriki racial só entra no 1st Year.
- **Afiliação**: `main_alliance` (Free, Revolutionaries, World Government) → alliance (organização) → rank.
