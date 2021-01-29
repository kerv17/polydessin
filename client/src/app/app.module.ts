import { HttpClientModule } from '@angular/common/http';
import { Injector, NgModule } from '@angular/core';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorPaletteComponent } from './components/color/color-palette/color-palette.component';
import { ColorSliderComponent } from './components/color/color-slider/color-slider.component';
import { ColorComponent } from './components/color/color.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { WidthSliderComponent } from './components/WidthModifier/width-slider/width-slider.component';

@NgModule({
    declarations: [
        AppComponent,
        EditorComponent,
        SidebarComponent,
        DrawingComponent,
        MainPageComponent,
        ColorSliderComponent,
        ColorPaletteComponent,
        ColorComponent,
        WidthSliderComponent,
    ],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, MatSliderModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
    static injector: Injector;
    constructor(injector: Injector) {
        AppModule.injector = injector;
    }
}
