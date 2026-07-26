ALTER TABLE pacientes
    ADD COLUMN peso_kg DECIMAL(5,2) NULL AFTER telefono,
    ADD COLUMN presion_sistolica INT NULL AFTER peso_kg,
    ADD COLUMN presion_diastolica INT NULL AFTER presion_sistolica,
    ADD COLUMN fecha_nacimiento DATE NULL AFTER presion_diastolica,
    ADD COLUMN sexo VARCHAR(20) NULL AFTER fecha_nacimiento;

UPDATE pacientes
SET peso_kg = CAST(REGEXP_REPLACE(peso, '[^0-9.]', '') AS DECIMAL(5,2))
WHERE peso IS NOT NULL AND REGEXP_REPLACE(peso, '[^0-9.]', '') <> '';

UPDATE pacientes
SET presion_sistolica = CAST(SUBSTRING_INDEX(presion, '/', 1) AS SIGNED),
    presion_diastolica = CAST(SUBSTRING_INDEX(presion, '/', -1) AS SIGNED)
WHERE presion IS NOT NULL AND presion LIKE '%/%';

ALTER TABLE pacientes
DROP COLUMN peso,
    DROP COLUMN presion;

ALTER TABLE pacientes
    ADD CONSTRAINT chk_pacientes_peso CHECK (peso_kg IS NULL OR (peso_kg BETWEEN 1 AND 400)),
    ADD CONSTRAINT chk_pacientes_sistolica CHECK (presion_sistolica IS NULL OR (presion_sistolica BETWEEN 50 AND 300)),
    ADD CONSTRAINT chk_pacientes_diastolica CHECK (presion_diastolica IS NULL OR (presion_diastolica BETWEEN 30 AND 200)),
    ADD CONSTRAINT chk_pacientes_sexo CHECK (sexo IS NULL OR sexo IN ('MASCULINO','FEMENINO','OTRO'));

ALTER TABLE citas
    ADD COLUMN peso_kg DECIMAL(5,2) NULL AFTER estado,
    ADD COLUMN presion_sistolica INT NULL AFTER peso_kg,
    ADD COLUMN presion_diastolica INT NULL AFTER presion_sistolica;

UPDATE citas
SET peso_kg = CAST(REGEXP_REPLACE(peso, '[^0-9.]', '') AS DECIMAL(5,2))
WHERE peso IS NOT NULL AND REGEXP_REPLACE(peso, '[^0-9.]', '') <> '';

UPDATE citas
SET presion_sistolica = CAST(SUBSTRING_INDEX(presion, '/', 1) AS SIGNED),
    presion_diastolica = CAST(SUBSTRING_INDEX(presion, '/', -1) AS SIGNED)
WHERE presion IS NOT NULL AND presion LIKE '%/%';

ALTER TABLE citas
DROP COLUMN peso,
    DROP COLUMN presion;

ALTER TABLE citas
    ADD CONSTRAINT chk_citas_peso CHECK (peso_kg IS NULL OR (peso_kg BETWEEN 1 AND 400)),
    ADD CONSTRAINT chk_citas_sistolica CHECK (presion_sistolica IS NULL OR (presion_sistolica BETWEEN 50 AND 300)),
    ADD CONSTRAINT chk_citas_diastolica CHECK (presion_diastolica IS NULL OR (presion_diastolica BETWEEN 30 AND 200));
