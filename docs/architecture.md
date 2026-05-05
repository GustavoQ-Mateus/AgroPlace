# AgroPlace Architecture

## Camadas

Frontend mockado em React consome dados locais e mantém as telas prontas para integração. O backend Spring Boot segue separação por domínio, aplicação, infraestrutura e interface HTTP.

## Backend

Controller recebe DTOs e delega para serviços. Serviços concentram regras de negócio e dependem de contratos de repositório. Repositórios isolam persistência via Spring Data JPA. Entidades representam o domínio persistente. DTOs mantêm o contrato HTTP separado do modelo interno.

## Banco

MySQL usa entidades normalizadas para usuários, perfis, espécies, raças, anúncios, imagens, rastreabilidade, propostas, contratos, pedidos, pagamentos, logística, mensagens e notificações.

## SOLID

Cada classe tem responsabilidade única, controllers não executam regra de negócio, serviços dependem de abstrações e DTOs evitam acoplamento direto entre API e persistência.

## Repositórios

O repositório principal contém front mockado, schema completo e backend parcial. O repositório `AgroPlace2` contém front mockado, schema completo e backend completo.
