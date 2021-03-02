import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatSliderModule } from '@angular/material/slider';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app/app.component';
import { ColorModalComponent } from './components/color/color-modal/color-modal.component';
import { ColorPaletteComponent } from './components/color/color-palette/color-palette.component';
import { ColorSliderComponent } from './components/color/color-slider/color-slider.component';
import { ColorComponent } from './components/color/color.component';
import { DrawingComponent } from './components/drawing/drawing.component';
import { EditorComponent } from './components/editor/editor.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { PointWidthSliderComponent } from './components/point-width-slider/point-width-slider/point-width-slider.component';
import { RadiusSliderComponent } from './components/radius-slider/radius-slider/radius-slider.component';
import { LineOptionsComponent } from './components/sidebar/lineOptions/line-options/line-options.component';
import { ShapeOptionsComponent } from './components/sidebar/shapeOptions/shape-options/shape-options.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { SprayAmountSliderComponent } from './components/spray-amount-slider/spray-amount-slider/spray-amount-slider.component';
import { WidthSliderComponent } from './components/width-slider/width-slider.component';
import { ColorService } from './services/color/color.service';
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
        ColorModalComponent,
        PointWidthSliderComponent,
        ShapeOptionsComponent,
        LineOptionsComponent,
        RadiusSliderComponent,
        SprayAmountSliderComponent,
    ],
    imports: [BrowserModule, HttpClientModule, AppRoutingModule, MatSliderModule, FormsModule],
    providers: [ColorService],
    bootstrap: [AppComponent],
    exports: [RadiusSliderComponent, SprayAmountSliderComponent],
})
export class AppModule {}
