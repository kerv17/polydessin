import { MetadataController } from '@app/controllers/metadata.controller';
import { MetadataService } from '@app/services/metadata.service';
import { TYPES } from '@app/types';
import { Container } from 'inversify';
import { Application } from './app';
import { ImgurController } from './controllers/imgur.controller';
import { Server } from './server';
import { DataAccessService } from './services/data-access.service';
import { DatabaseService } from './services/database.service';
import { ImgurSaveService } from './services/imgur-save.service';
import { ServerSaveService } from './services/server-save.service';

export const containerBootstrapper: () => Promise<Container> = async () => {
    const container: Container = new Container();

    container.bind(TYPES.Server).to(Server);
    container.bind(TYPES.Application).to(Application);

    container.bind(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();

    container.bind(TYPES.ServerSaveService).to(ServerSaveService).inSingletonScope();

    container.bind(TYPES.MetadataController).to(MetadataController);
    container.bind(TYPES.MetadataService).to(MetadataService);
    container.bind(TYPES.ImgurController).to(ImgurController);
    container.bind(TYPES.DataAccessService).to(DataAccessService);
    container.bind(TYPES.ImgurSaveService).to(ImgurSaveService);

    return container;
};
