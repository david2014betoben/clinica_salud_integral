## Entity: PACIENTES

| Atributo         | Tipo   | Notas    |
| ---------------- | ------ | -------- |
| ID               | SERIAL | [PK]     |
| NOMBRE           | Texto  | NOT NULL |
| AP_PATERNO       | Texto  | NOT NULL |
| AP_MATERNO       | Texto  | NULL     |
| EMAIL            | Texto  | UNICO    |
| TELEFONO         | Texto  | NULL     |
| FECHA_NACIMIENTO | DATE   | NULL     |

""Un paciente puede tener muchas citas, pero una cita le pertenece a solo un paciente""

## Entity: HISTORIAL CLINICO

| Atributo    | Tipo    | Notas    |
| ----------- | ------- | -------- |
| ID          | SERIAL  | [PK]     |
| PESO        | NUMERIC | NOT NULL |
| ALTURA      | NUMERIC | NOT NULL |
| DIAGNOSTICO | Texto   | NOT NULL |
| TRATAMIENTO | Texto   | NOT NULL |
| ID_CITAS    | INT     | [FK]     |

""Una cita puede o no tener un historial clinico, y un historial clinico solo puede pertenecer a una cita""

## Entity: ESPECIALIDADES

| Atributo | Tipo   | Notas    |
| -------- | ------ | -------- |
| ID       | SERIAL | [PK]     |
| NOMBRE   | TEXTO  | NOT NULL |

""Una especialidad pueden tener muchos medicos o no tener ninguno, pero un medico solo trabaja con una especialidad""

## Entity: MEDICOS

| Atributo     | Tipo   | Notas    |
| ------------ | ------ | -------- |
| ID           | SERIAL | [PK]     |
| NOMBRE       | Texto  | NOT NULL |
| AP_PATERNO   | Texto  | NOT NULL |
| AP_MATERNO   | Texto  | NULL     |
| EMAIL        | Texto  | UNICO    |
| TELEFONO     | Texto  | NULL     |
| ESPECIALIDAD | INT    | [FK]     |

""Un medico puede tener muchas citas, pero una cita solo puede tener un medico""

## Entity: CITAS

| Atributo     | Tipo   | Notas    |
| ------------ | ------ | -------- |
| ID           | SERIAL | [PK]     |
| FECHA        | DATE   | NOT NULL |
| HORA         | TIME   | NOT NULL |
| ESTADO       | Texto  | NOT NULL |
| ID_PACIENTES | INT    | [FK]     |
| ID_MEDICOS   | INT    | [FK]     |
