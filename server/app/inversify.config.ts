import { DateController } from '@app/controllers/date.controller';
import { IndexController } from '@app/controllers/index.controller';
import { MetadataController } from '@app/controllers/metadata.controller';
import { DateService } from '@app/services/date.service';
import { IndexService } from '@app/services/index.service';
import { MetadataService } from '@app/services/metadata.service';
import { DatabaseService } from "./services/database.service";
import { Container } from 'inversify';
import { Application } from './app';
import { Server } from './server';
import { TYPES } from '@app/types';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);
    
    container.bind(TYPES.IndexController).to(IndexController);
    container.bind(TYPES.IndexService).to(IndexService);

    container.bind(TYPES.DateController).to(DateController);
    container.bind(TYPES.DateService).to(DateService);
    
    container.bind(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();

    container.bind(TYPES.MetadataController).to(MetadataController);
    container.bind(TYPES.MetadataService).to(MetadataService);

    return container;
};
