module.exports = Object.freeze({
    TURN_ON_PRAGMA:      `PRAGMA foreign_keys=ON;`,
    CREATE_TABLE_DETENU: `create table if not exists Detenu(
                            n_ecrou varchar(10),
                            prenom varchar(30),
                            nom varchar(30),
                            date_naissance Date,
                            lieu_naissance varchar(30),
                            constraint Detenu_key primary key(n_ecrou));`,
    CREATE_TABLE_AFFAIRE: `create table if not exists Affaire(
                            n_affaire varchar(10),
                            nom_juridiction varchar(30),
                            date_faits Date,
                            constraint Affaire_key primary key(n_affaire,nom_juridiction));`,
    CREATE_TABLE_DETENU_AFFAIRE: `create table if not exists Detenu_Affaire(
                            n_ecrou varchar(10),
                            n_affaire varchar(10),
                            nom_juridiction varchar(30),
                            constraint Detenu_Affaire_key primary key(n_ecrou,n_affaire,nom_juridiction),
                            constraint Detenu_Affaire_foreign_key foreign key(n_ecrou) references Detenu(n_ecrou),
                            constraint Detenu_Affaire_foreign_key2 foreign key(n_affaire,nom_juridiction) references Affaire(n_affaire,nom_juridiction));`,
    CREATE_TABLE_MOTIF: `create table if not exists Motif(
                            n_motif varchar(10),
                            libelle_motif varchar(50) not null,
                            constraint Motif_key primary key(n_motif),
                            constraint Motif_unique unique(libelle_motif));`,
    CREATE_TABLE_INCARCERATION: `create table if not exists Incarceration(
                            n_ecrou varchar(10),
                            n_affaire varchar(10) not null,
                            nom_juridiction varchar(30) not null,
                            date_incarceration Date,
                            n_motif varchar(10) not null,
                            constraint Incarceration_key primary key(n_ecrou),
                            constraint Incarceration_foreign_key foreign key(n_ecrou,n_affaire,nom_juridiction) references Detenu_Affaire(n_ecrou,n_affaire,nom_juridiction),
                            constraint Incarceration_foreign_key2 foreign key(n_motif) references Motif(n_motif));`,
    CREATE_TABLE_DECISION: `create table if not exists Decision(
                            n_type_decision varchar(1),
                            n_ecrou varchar(10),
                            date_decision Date,
                            constraint Decision_key primary key(n_type_decision,n_ecrou,date_decision),
                            constraint Decision_fk foreign key(n_ecrou) references Detenu(n_ecrou));`,
    CREATE_TABLE_CONDAMNATION: `create table if not exists Condamnation(
                            n_type_decision varchar(1), 
                            n_ecrou varchar(10),
                            date_decision Date,
                            duree Integer,
                            constraint Condamnation_key primary key(n_type_decision,n_ecrou,date_decision),
                            constraint Condamnation_fk foreign key(n_type_decision,n_ecrou,date_decision) references Decision(n_type_decision,n_ecrou,date_decision) on delete cascade);`,
    CREATE_TABLE_REDUCION_PEINE: `create table if not exists Reduction_peine(
                            n_type_decision varchar(1),
                            n_ecrou varchar(10),
                            date_decision Date,
                            duree Integer,
                            constraint Reduction_peine_key primary key(n_type_decision,n_ecrou,date_decision),
                            constraint Reduction_peine_fk foreign key(n_type_decision,n_ecrou,date_decision) references Decision(n_type_decision,n_ecrou,date_decision) on delete cascade);`,
    CREATE_TABLE_LIBERATION_DEFINITIVE: `create table if not exists Liberation_definitive(
                            n_type_decision varchar(1),
                            n_ecrou varchar(10),
                            date_decision Date,
                            date_liberation Date,
                            constraint Liberation_definitive_key primary key(n_type_decision,n_ecrou,date_decision),
                            constraint Liberation_definitive_fk foreign key(n_type_decision,n_ecrou,date_decision) references Decision(n_type_decision,n_ecrou,date_decision) on delete cascade);`
});