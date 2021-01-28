import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ColorSliderComponent } from './components/color/color-slider/color-slider.component';
import { ColorPaletteComponent } from './components/color/color-palette/color-palette.component';
import { ColorComponent } from './components/color/color.component';
import { ColorModalComponent } from './components/color/color-modal/color-modal.component';

@NgModule({
    declarations: [AppComponent, EditorComponent, SidebarComponent, DrawingComponent, MainPageComponent, ColorSliderComponent, ColorPaletteComponent, ColorComponent, ColorModalComponent],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {}
