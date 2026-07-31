# Agregado Device

## Aggregate Root

`Device`

## Entidades

- DataSource
- Measurement
- SyncSession
- PermissionGrant
- DeviceIdentity

## Invariantes

- Cada medição registra fonte e timestamp.
- Duplicidades devem ser detectadas.
- Dados importados mantêm timezone original.
- Permissões podem ser revogadas.
