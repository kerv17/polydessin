import { Injectable } from '@angular/core';
import { DrawingService } from '@app/services/drawing/drawing.service';
import { IndexService } from '@app/services/index/index.service';

@Injectable({
  providedIn: 'root'
})
export class RemoteSaveService {
  constructor(public drawingService: DrawingService, private indexService: IndexService) {}
  showModalSave: boolean = false;
  post(): void {
    this.indexService.basicPost()
  }

}

/*delete(): void {
  this.initialiserCanvas();
  // this.indexService.basicDelete('test').subscribe((x) => window.alert(x.title));
}
initialiserCanvas(): void {
  this.indexService.basicGet().subscribe((x) => {
      this.pictures = new Array(x.length);
      console.log(x);
      let i = 0;
      for (const element of x) {
          this.pictures[i] = element;

          i++;
      }
      console.log(this.pictures[0]);
  });
}

//metre dans le serveur
saveImage(type: string, name: string): void {
  if (type != undefined && name !== '') {
      if (confirm('Êtes-vous sûr de vouloir exporter le dessin')) {
          const a = document.createElement('a');
          a.href = this.drawingService.canvas.toDataURL('image/' + type);
          a.download = name;
          document.body.appendChild(a);
          a.click();
      }
  } else {
      window.alert('Veuillez entrer un nom et choisir le type de fichier ');
  }
}*/