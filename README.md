# basis
framework/boilerplate basico em Nodejs

Etapa 1: escolhas.
Estou optando por essa arquitetura, pois a ideia é uma base, com potencial para, se necessário, manter um projeto robusto, mesmo sendo mais "trabalhoso" no início; o foco é ter algo sólido.

O framework segue os princípios de **DDD + Clean Architecture + Ports & Adapters**.

                        Requisição HTTP
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Presentation     │
                    │─────────────────────│
                    │ Controller          │
                    │ Middleware          │
                    │ Request Validation  │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    Application      │
                    │─────────────────────│
                    │ Use Cases           │
                    │ DTOs                │
                    │ Commands            │
                    │ Queries             │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       Domain        │
                    │─────────────────────│
                    │ Entities            │
                    │ Aggregates          │
                    │ Value Objects       │
                    │ Domain Services     │
                    │ Domain Events       │
                    │ Repository Ports    │
                    └─────────────────────┘
                               │
                 (Interfaces / Contracts)
                               │
───────────────────────────────┼──────────────────────────────
                               │
                               ▼
                    ┌─────────────────────┐
                    │   Infrastructure     │
                    │─────────────────────│
                    │ Prisma Repository   │
                    │ Redis Cache         │
                    │ SMTP / Resend       │
                    │ S3 / Storage        │
                    │ BullMQ              │
                    │ JWT                 │
                    └─────────────────────┘
                               │
                               ▼
                  Banco de Dados / APIs / Serviços


Presentation
      │
      ▼
Application
      │
      ▼
Domain  (Foco)
      ▲
      │
Infrastructure



Cada camada possui apenas uma responsabilidade.

| Camada | Responsabilidade |
|---------|------------------|
| Presentation | Receber e responder requisições |
| Application | Orquestrar casos de uso |
| Domain | Executar regras de negócio |
| Infrastructure | Comunicar com tecnologias externas |


# Regra de Dependências

Presentation ─────────► Application

Application ──────────► Domain

Infrastructure ───────► Domain

Domain ───────────────► Ninguém