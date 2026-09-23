
var array_types=[];
var current_array_type_ID;
var high_low=[];
var current_high_low;
var smoothed_unsmoothed=[];
var current_smoothed_unsmoothed;
var d=[];
var n=[];
var current_dist=[];
var mousegraphX,mousegraphY;
var current_mouseX,locked_mouseX;
var current_mouseY,locked_mouseY;
var classic_curve_x=[];
var classic_curve_y=[];



var graph_start_x,graph_start_y;
var dist1_start_x,dist1_start_y;
var dist2_start_x,dist2_start_y;

var image_files=[];

var distribution_image_size;
var distribution_image_scale;

var dist_1d_height;
var dist_1d_width;
var dist_1d_scale;

var maxval;

var locked;


 let img; 
 let logo;
let distribution_images_2D=[];

var mousegraphXa,mousegraphYa;


function setup() {
  
  locked=false;
  
  
  mousegraphXa=0;
  mousegraphYa=0;
  
  current_array_type_ID=3;
  current_high_low=0;
  current_smoothed_unsmoothed=0;
  
  distribution_image_size=400;
  distribution_image_scale=5;
  
  maxval=0.012;
  
  graph_start_x=70;
  graph_start_y=100;
  
  dist1_start_x=70;
  dist1_start_y=530;
  dist2_start_x=500;
  dist2_start_y=100;
  
  dist_1d_scale=300;
  
  dist_1d_height=120;
  dist_1d_width=400;
  
  mousegraphX,mousegraphY=false;
  
  // print("loading data");
  var canvas =createCanvas(1280, 720);
  // var x = (windowWidth - width) / 2;
  // var y = (windowHeight - height) / 2;
 //  cnv.position(x, y);
  // img = loadImage('images/med_naive_ODD_smoothed.png'); 
   canvas.parent('sketch-holder');

   
   logo = loadImage('images/logo-icon_50px.png'); 
   // logo.resize(50, 50);

    load_data();
    print("data loaded");
    smooth();
    print(current_array_type_ID +" "+current_high_low);
    current_dist=d[current_array_type_ID][current_high_low];
  
   for(let i=0;i<4;i++){
     for(let j=0;j<2;j++){
       for(let k=0;k<2;k++){
         distribution_images_2D[i][j][k]= loadImage('images/' + image_files[i][j][k]); 
       }
     }
   }
  
}


function draw() {
  
  if(locked){
    current_mouseX=locked_mouseX;
    current_mouseY=locked_mouseY;
    
  }else{
    current_mouseX=mouseX;
    current_mouseY=mouseY;
    
  }
  
  
  background(255);
  // stroke(255,255,255);
  // rect(0,0,1280, 720);
  
  stroke(68,188,157);
  noFill();
  // rect(0,0,1279, 719);
  image(logo, 19, 15);
  
  
  // image(img, graph_start_x, graph_start_y);
  
  // image(img, graph_start_x, graph_start_y);
  image(distribution_images_2D[current_array_type_ID][current_high_low][current_smoothed_unsmoothed], graph_start_x, graph_start_y);
  

  
  stroke(0,0,0);
  fill(0,0,0);
  strokeWeight(1); 
  textSize(24)
  textAlign(LEFT);
  if(current_array_type_ID==3){
    text("Oxygen Dissociation Distribution", 100, 40);
  }else if(current_array_type_ID==1){
    if(current_high_low==0){
      text("Oxygen Dissociation Distribution - High pCO ", 100, 40);
      textSize(16);
      text("2", 572,45);
      textSize(24);
    }else{
      text("Oxygen Dissociation Distribution - Low pCO ", 100, 40);
      textSize(16);
      text("2", 568,45);
      textSize(24);
    }
    
  }else{
    text("Oxygen Dissociation Distribution - "+ high_low[current_high_low] +" "+array_types[current_array_type_ID], 100, 40);
    
  }
  text("Conditional Probability Distributions", 795, 40);
  
  textSize(12);
  
  text("pO  (mm Hg)", 227, 68);
    textSize(8);
    text("2", 244,71);
    textSize(12);

  
  
  textAlign(RIGHT);
  for(let i=0;i<=8;i++){
     textAlign(RIGHT);
    stroke(0,0,0);
    noFill();
    line(graph_start_x,graph_start_y+distribution_image_size-i*distribution_image_scale*10,graph_start_x-5,graph_start_y+distribution_image_size-i*distribution_image_scale*10);
    text(i*10+20, graph_start_x-8, graph_start_y+distribution_image_size-i*distribution_image_scale*10+5);
    textAlign(LEFT);
    line(dist2_start_x+dist_1d_height,graph_start_y+distribution_image_size-i*distribution_image_scale*10,dist2_start_x+dist_1d_height+5,graph_start_y+distribution_image_size-i*distribution_image_scale*10);
    text(i*10+20, dist2_start_x+dist_1d_height+10, dist2_start_y+dist_1d_width-i*distribution_image_scale*10+5);
    
     textAlign(RIGHT);
    
    
    line(graph_start_x+i*distribution_image_scale*10,graph_start_y,graph_start_x+i*distribution_image_scale*10,graph_start_y-5);
    text(i*10+20, graph_start_x+i*distribution_image_scale*10+7, graph_start_y-8);
    
    text(i*10+20, dist1_start_x+i*distribution_image_scale*10+7, dist1_start_y+dist_1d_height  +18);
   //  stroke(220,220,220);
    line(dist1_start_x+i*distribution_image_scale*10,dist1_start_y+dist_1d_height,dist1_start_x+i*distribution_image_scale*10,dist1_start_y+dist_1d_height+5);
    
  }
  
  
  // fill(245,245,245);
  fill(208,238,231); 
  fill(227,244,240); 
  rect(dist1_start_x,dist1_start_y,distribution_image_size,dist_1d_height);

  rect(dist2_start_x,dist2_start_y,dist_1d_height,distribution_image_size);
  
  
  
  stroke(220,220,220);
  fill(220,220,220);
  
  
  for(let i=1;i<8;i++){
    stroke(200,200,200);
     fill(200,200,200);
    // grid lines in the 2D distribution
    line(graph_start_x,graph_start_y+distribution_image_size-i*distribution_image_scale*10,graph_start_x+distribution_image_size,graph_start_y+distribution_image_size-i*distribution_image_scale*10);
    line(graph_start_x+i*distribution_image_scale*10,graph_start_y+distribution_image_size,graph_start_x+i*distribution_image_scale*10,graph_start_y+distribution_image_size-distribution_image_size);
    
    // lines in 1D dist 1

    stroke(68,188,157);
    fill(68,188,157); 
    
    line(dist1_start_x+i*distribution_image_scale*10,dist1_start_y+1,dist1_start_x+i*distribution_image_scale*10,dist1_start_y+dist_1d_height); 
    line(dist2_start_x,dist2_start_y+i*distribution_image_scale*10,dist2_start_x+dist_1d_height,dist2_start_y+i*distribution_image_scale*10); 
    
  }
  

  

  
  stroke(0,0,0);
  noFill();
  rect(graph_start_x,graph_start_y,distribution_image_size,distribution_image_size);
  
  

  
  stroke(68,188,157);
  
    if((mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size) | locked){
        if(locked && (mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size)){
 
 
          stroke(213,240,234);
         line(mouseX,graph_start_y+1,mouseX,graph_start_y+distribution_image_size-1);
         line(graph_start_x+1,mouseY,graph_start_x+distribution_image_size-1,mouseY);
          
        }
        
        stroke(68,188,157);
      line(current_mouseX,graph_start_y+1,current_mouseX,graph_start_y+distribution_image_size-1);
      line(graph_start_x+1,current_mouseY,graph_start_x+distribution_image_size-1,current_mouseY);
       mousegraphX=floor((current_mouseX-graph_start_x)/5)+20;
       mousegraphY=floor((current_mouseY-graph_start_y)/5);
       

       
       
       
      
    }else{
     mousegraphX=false;
     mousegraphY=false;
    }
  
  
  if(locked){
   stroke(255,0,0);
   fill(255,0,0);
   rect(current_mouseX-1,current_mouseY-1,2,2);
    
  }
  
  
  stroke(0,0,0);
  fill(0,0,0);
  // line(dist1_start_x,dist1_start_y,dist1_start_x,dist1_start_y+dist_1d_height);
  // line(dist1_start_x,dist1_start_y+dist_1d_height,dist1_start_x+distribution_image_size,dist1_start_y+dist_1d_height);
  noFill();

  
  
  if(mousegraphX && mousegraphY){

    var probsum_pao2;
    var probsum_sao2;
    var probsum_pao2a;
    var probsum_sao2a;
    probsum_pao2=0;
    probsum_sao2=0;
    probsum_pao2a=0;
    probsum_sao2a=0;
    
    var scale_temp2=300;
    
    for(let i=1;i<100;i++){
       probsum_sao2+=current_dist[current_smoothed_unsmoothed][mousegraphX][i];
      probsum_pao2+=current_dist[current_smoothed_unsmoothed][i][100-mousegraphY]   ;
    }
     mousegraphXa=floor((mouseX-graph_start_x)/5)+20;
     mousegraphYa=floor((mouseY-graph_start_y)/5);
         
         
    if(locked && (mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size)){
      for(let i=1;i<100;i++){
        probsum_sao2a+=current_dist[current_smoothed_unsmoothed][mousegraphXa][i];
         probsum_pao2a+=current_dist[current_smoothed_unsmoothed][i][100-mousegraphYa]   ;
      }
      
    }
    
    for(let i=21;i<100;i++){
     //  print(i);
     //  print(mousegraphX);
     //  print(mousegraphY);
     
     
      stroke(0,0,0);
     //   line(dist1_start_x+distribution_image_scale*i,dist1_start_y+dist_1d_height-current_dist[0][mousegraphX][i]/maxval*dist_1d_scale,dist1_start_x+distribution_image_scale*(i-1),dist1_start_y+dist_1d_height-current_dist[0][mousegraphX][i-1]/maxval*dist_1d_scale);
     //   line(dist2_start_x+distribution_image_scale*i,dist2_start_y+dist_1d_height-current_dist[0][i][100-mousegraphY]/maxval*dist_1d_scale,dist2_start_x+distribution_image_scale*(i-1),dist2_start_y+dist_1d_height-current_dist[0][i-1][100-mousegraphY]/maxval*dist_1d_scale);

         
         
        if(locked && (mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size)){
          stroke(100,200,175);
          // right hand side d1D distribution (mouse location)
          line(dist2_start_x+current_dist[current_smoothed_unsmoothed][mousegraphXa][i]/probsum_sao2a*scale_temp2,dist2_start_y+distribution_image_size-distribution_image_scale*(i-20),dist2_start_x+current_dist[current_smoothed_unsmoothed][mousegraphXa][i-1]/probsum_sao2a*scale_temp2,dist2_start_y+distribution_image_size-distribution_image_scale*((i-20)-1));
          // bottom 1d distribution (mouse location
          line(dist1_start_x+distribution_image_scale*(i-20),dist1_start_y+dist_1d_height-current_dist[current_smoothed_unsmoothed][i][100-mousegraphYa]/probsum_pao2a*scale_temp2,dist1_start_x+distribution_image_scale*(i-21),dist1_start_y+dist_1d_height-current_dist[current_smoothed_unsmoothed][i-1][100-mousegraphYa]/probsum_pao2a*scale_temp2);
        }
        
        stroke(0,0,0);
        // right hand side d1D distribution
        line(dist2_start_x+current_dist[current_smoothed_unsmoothed][mousegraphX][i]/probsum_sao2*scale_temp2,dist2_start_y+distribution_image_size-distribution_image_scale*(i-20),dist2_start_x+current_dist[current_smoothed_unsmoothed][mousegraphX][i-1]/probsum_sao2*scale_temp2,dist2_start_y+distribution_image_size-distribution_image_scale*((i-20)-1));
        // bottom 1d distribution
        line(dist1_start_x+distribution_image_scale*(i-20),dist1_start_y+dist_1d_height-current_dist[current_smoothed_unsmoothed][i][100-mousegraphY]/probsum_pao2*scale_temp2,dist1_start_x+distribution_image_scale*((i-20)-1),dist1_start_y+dist_1d_height-current_dist[current_smoothed_unsmoothed][i-1][100-mousegraphY]/probsum_pao2*scale_temp2);
    


      // unsmoothed points (not normalised)
      /*
      stroke(68,188,157);
      if(current_dist[0][mousegraphX][i]>0){
         rect(dist1_start_x+distribution_image_scale*i,dist1_start_y+dist_1d_height-current_dist[1][mousegraphX][i]/maxval*dist_1d_scale,-2,-2);
      }
      if(current_dist[1][i][100-mousegraphY]>0){
         rect(dist2_start_x+5*i,dist2_start_y+dist_1d_height-current_dist[1][i][100-mousegraphY]/maxval*dist_1d_scale,-2,-2); 
      }
      */

    }
    
  }
  
  

  // line(dist2_start_x,dist2_start_y,dist2_start_x,dist2_start_y+dist_1d_width);
  // line(dist2_start_x,dist2_start_y+dist_1d_height,dist2_start_x+distribution_image_size,dist2_start_y+dist_1d_height);
  
  

  
  
  
  fill(0,0,0);
  stroke(0,0,0);
  translate(35, 275);
  rotate(-PI/2);
  
  text("SO  (%)", 0, 0);
    textSize(8);
    text("2", -20,3);
    textSize(12);
  rotate(PI/2);
  translate(-35, -275);
  
  
  textAlign(LEFT);
  if(mousegraphY){
    text("pO  (mm Hg) - at "+(100-mousegraphY)+"% SO ", 200, 690);
    textSize(8);
    text("2", 217,693);
    text("2", 337,693);
    textSize(12);
  }else{
    text("pO  (mm Hg)", 200, 690);
    textSize(8);
    text("2", 217,693);
    // text("2", 352,693);
    textSize(12);
  }
  translate(660, 200);
  rotate(PI/2);
  if(mousegraphX){
    text("SO  (%) - at "+(mousegraphX)+"mm Hg pO", 0,0);
    textSize(8);
    text("2", 16,3);
    text("2", 138,3);
    textSize(12);
  }else{
    text("SO  (%)", 0,0);
    textSize(8);
    text("2", 16,3);
    textSize(12);
  }
  rotate(-PI/2);
  translate(-660, -200);
  
  noFill()
  rect(500,630,120,20);

  if(current_array_type_ID==3){
    noFill();
    rect(500,630,60,20);
    rect(560,630,60,20);
    
  }else if(current_high_low==0){
    stroke(0,0,0);
    fill(208,238,231);
    fill(227,244,240); 
    rect(500,630,60,20);
    noFill();
    rect(560,630,60,20);
  }else{
    stroke(0,0,0);
    noFill();

    rect(500,630,60,20);
    fill(208,238,231);
    fill(227,244,240); 
    rect(560,630,60,20);
    
    
  }
  stroke(0,0,0);
  fill(0,0,0);
  text("High", 520,645);
  text("Low", 575,645);
  

  // text("Compare by:", 520,525);
  
  
  if(current_array_type_ID==2){ 
    fill(208,238,231);
    fill(227,244,240); 
  }else{
    noFill();
    stroke(0,0,0);
  }
  rect(500,530,120,20);
  fill(0,0,0);
  text("pH", 550,545);
  
  if(current_array_type_ID==1){ 
    fill(208,238,231);
    fill(227,244,240); 
  }else{
    noFill();
    
  }
  rect(500,550,120,20);
  fill(0,0,0);
  text("pCO ", 545,565);
    textSize(8);
    text("2", 571,568);
    textSize(12);
  if(current_array_type_ID==0){ 
    fill(208,238,231);
    fill(227,244,240); 
  }else{
    noFill();
    
  }
  rect(500,570,120,20);
  fill(0,0,0);
  text("Age", 550,585);
  
  if(current_array_type_ID==3){ 
    fill(208,238,231);
    fill(227,244,240); 
  }else{
    noFill();
    
  }
  
  
  rect(500,590,120,20);
  fill(0,0,0);
  text("None", 545,605);
  
  
 //  fill(240,240,240);
 // stroke(68,188,157);
 //  noFill();
 //  rect(710,40,550,640)
  
  if(mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size){
    text("SO  (%) - at "+(mousegraphXa)+"mm Hg pO ",770,75);
    text("pO  (mm Hg) - at "+(100-mousegraphYa)+"% SO ", 1040, 75);
    textSize(8);
    text("2", 786,78);
    text("2", 1057,78);
    text("2", 907,78);
    text("2", 1177,78);
    textSize(12);
    
  
  }else if(locked){
    text("SO  (%) - at "+(mousegraphX)+"mm Hg pO ",770,75);
    text("pO  (mm Hg) - at "+(100-mousegraphY)+"% SO ", 1040, 75);
    textSize(8);
    text("2", 786,78);
    text("2", 1057,78);
    
    text("2", 907,78);
    text("2", 1177,78);
    
    textSize(12);
    
  }else{
    text("SO  (%) ",770,75);
    text("pO  (mm Hg) ", 1040, 75);
    textSize(8);
    text("2", 786,78);
    text("2", 1057,78);
    
    textSize(12);
  }
  
  
  
 // (xloc,yloc,xdim,ydim,type,high/low)
 
  draw_dist(725,100,240,150,2,0);
  draw_dist(725,300,240,150,1,0);
  draw_dist(725,500,240,150,0,0);
  draw_dist(1000,100,240,150,2,1);
  draw_dist(1000,300,240,150,1,1);
  draw_dist(1000,500,240,150,0,1);

// stroke(0,0,0);
// fill(0,0,0);
 stroke(68,188,157);
 fill(68,188,157);
// stroke(150,150,150);
// fill(150,150,150);

  for(let i=19;i<=98;i+=2){
    line(
    graph_start_x+(classic_curve_x[i]-20)*distribution_image_scale,
    graph_start_y+distribution_image_size-(classic_curve_y[i]-20)*distribution_image_scale,
    graph_start_x+(classic_curve_x[i+1]-20)*distribution_image_scale,
    graph_start_y+distribution_image_size-(classic_curve_y[i+1]-20)*distribution_image_scale
    );
    
  }
  
}


function draw_dist(xloc,yloc,xdim,ydim,chart_type_ID,axis_flag){
  var scale_temp=30000;
  var scale_temp2=370;
  stroke(0,0,0);
  fill(208,238,231);
  fill(227,244,240); 
  // fill(255,255,255);  
  rect(xloc,yloc,xdim,ydim);
  noFill();
  textSize(10);
  stroke(150,150,150);
  if(chart_type_ID==1){
    text("High pCO " ,xloc+20,yloc-4);
    textSize(6);
    text("2", xloc+65,yloc-2);
    textSize(10);
    line(xloc,yloc-8,xloc+15,yloc-8);
    stroke(68,188,157);
    text("Low pCO "  ,xloc+100,yloc-4);
    textSize(6);
    text("2", xloc+143,yloc-2);
    textSize(10);
    
    line(xloc+80,yloc-8,xloc+95,yloc-8);
    stroke(0,0,0);
    text("Baseline " ,xloc+180,yloc-4);
    line(xloc+160,yloc-8,xloc+175,yloc-8);
  }else{
    text("High " + array_types[chart_type_ID] ,xloc+20,yloc-4);
    line(xloc,yloc-8,xloc+15,yloc-8);
    stroke(68,188,157);
    text("Low " + array_types[chart_type_ID] ,xloc+100,yloc-4);
    line(xloc+80,yloc-8,xloc+95,yloc-8);
    stroke(0,0,0);
    text("Baseline " ,xloc+180,yloc-4);
    line(xloc+160,yloc-8,xloc+175,yloc-8);
  }
  textSize(8);
  for(let i=20;i<=100;i+=10){
    stroke(0,0,0);
    line(xloc+(i-20)*3,yloc+ydim,xloc+(i-20)*3,yloc+ydim+5);
    stroke(68,188,157);
    line(xloc+(i-20)*3,yloc+ydim,xloc+(i-20)*3,yloc);
    stroke(0,0,0);
    text(i,xloc+(i-20)*3-4,yloc+ydim+15);
  }
  stroke(0,0,0);
  noFill();  
  rect(xloc,yloc,xdim,ydim);
  var probsum_baseline,probsum_high,probsum_low;
  probsum_baseline=0;
  probsum_high=0;
  probsum_low=0;


    if(mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size ){
        for(let i=0;i<100;i++){
          if(axis_flag==0){
            probsum_baseline+=d[3][0][current_smoothed_unsmoothed][mousegraphXa][i];
            probsum_high+=d[chart_type_ID][0][current_smoothed_unsmoothed][mousegraphXa][i];
            probsum_low+=d[chart_type_ID][1][current_smoothed_unsmoothed][mousegraphXa][i];
          }else{
            probsum_baseline+=d[3][0][current_smoothed_unsmoothed][i][100-mousegraphYa];
            probsum_high+=d[chart_type_ID][0][current_smoothed_unsmoothed][i][100-mousegraphYa];
            probsum_low+=d[chart_type_ID][1][current_smoothed_unsmoothed][i][100-mousegraphYa];
          }
        }
       }else if(locked){
         
        for(let i=0;i<100;i++){
            if(axis_flag==0){
              probsum_baseline+=d[3][0][current_smoothed_unsmoothed][mousegraphX][i];
              probsum_high+=d[chart_type_ID][0][current_smoothed_unsmoothed][mousegraphX][i];
              probsum_low+=d[chart_type_ID][1][current_smoothed_unsmoothed][mousegraphX][i];
            }else{
              probsum_baseline+=d[3][0][current_smoothed_unsmoothed][i][100-mousegraphY];
              probsum_high+=d[chart_type_ID][0][current_smoothed_unsmoothed][i][100-mousegraphY];
              probsum_low+=d[chart_type_ID][1][current_smoothed_unsmoothed][i][100-mousegraphY];
            }
         } 
         
       }



  
  
  if(mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size){

      
    
    
    
    if(axis_flag==0){
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][mousegraphXa][i]/probsum_high*scale_temp2,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][mousegraphXa][i-1]/probsum_high*scale_temp2);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][mousegraphXa][i]/probsum_low*scale_temp2,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][mousegraphXa][i-1]/probsum_low*scale_temp2);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][mousegraphXa][i]/probsum_baseline*scale_temp2,xloc+(i-1-20)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][mousegraphXa][i-1]/probsum_baseline*scale_temp2);
     
      }
    }else{

        
      
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][i][100-mousegraphYa]/probsum_high*scale_temp2,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][i-1][100-mousegraphYa]/probsum_high*scale_temp2);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][i][100-mousegraphYa]/probsum_low*scale_temp2,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][i-1][100-mousegraphYa]/probsum_low*scale_temp2);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][i][100-mousegraphYa]/probsum_baseline*scale_temp2,xloc+((i-20)-1)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][i-1][100-mousegraphYa]/probsum_baseline*scale_temp2);
     
      }
      
      
    }
  }else if(locked){
    
 
    
     if(axis_flag==0){
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][mousegraphX][i]/probsum_high*scale_temp2,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][mousegraphX][i-1]/probsum_high*scale_temp2);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][mousegraphX][i]/probsum_low*scale_temp2,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][mousegraphX][i-1]/probsum_low*scale_temp2);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][mousegraphX][i]/probsum_baseline*scale_temp2,xloc+(i-1-20)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][mousegraphX][i-1]/probsum_baseline*scale_temp2);
     
      }
    }else{
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][i][100-mousegraphY]/probsum_high*scale_temp2,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][0][current_smoothed_unsmoothed][i-1][100-mousegraphY]/probsum_high*scale_temp2);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][i][100-mousegraphY]/probsum_low*scale_temp2,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][1][current_smoothed_unsmoothed][i-1][100-mousegraphY]/probsum_low*scale_temp2);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][i][100-mousegraphY]/probsum_baseline*scale_temp2,xloc+((i-20)-1)*3,yloc+ydim-d[3][0][current_smoothed_unsmoothed][i-1][100-mousegraphY]/probsum_baseline*scale_temp2);
     
      }
    }
    
  }
  
  
  
  
/*  
  if(mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size){
    if(axis_flag==0){
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][0][mousegraphXa][i]*scale_temp,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][0][0][mousegraphXa][i-1]*scale_temp);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][0][mousegraphXa][i]*scale_temp,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][1][0][mousegraphXa][i-1]*scale_temp);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][0][mousegraphXa][i]*scale_temp,xloc+(i-1-20)*3,yloc+ydim-d[3][0][0][mousegraphXa][i-1]*scale_temp);
     
      }
    }else{
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][0][i][100-mousegraphYa]*scale_temp,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][0][0][i-1][100-mousegraphYa]*scale_temp);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][0][i][100-mousegraphYa]*scale_temp,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][1][0][i-1][100-mousegraphYa]*scale_temp);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][0][i][100-mousegraphYa]*scale_temp,xloc+((i-20)-1)*3,yloc+ydim-d[3][0][0][i-1][100-mousegraphYa]*scale_temp);
     
      }
      
      
    }
  }else if(locked){
     if(axis_flag==0){
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][0][mousegraphX][i]*scale_temp,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][0][0][mousegraphX][i-1]*scale_temp);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][0][mousegraphX][i]*scale_temp,xloc+(i-1-20)*3,yloc+ydim-d[chart_type_ID][1][0][mousegraphX][i-1]*scale_temp);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][0][mousegraphX][i]*scale_temp,xloc+(i-1-20)*3,yloc+ydim-d[3][0][0][mousegraphX][i-1]*scale_temp);
     
      }
    }else{
      for(let i=21;i<100;i++){
        stroke(150,150,150);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][0][0][i][100-mousegraphY]*scale_temp,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][0][0][i-1][100-mousegraphY]*scale_temp);
        stroke(68,188,157);
        line(xloc+(i-20)*3,yloc+ydim-d[chart_type_ID][1][0][i][100-mousegraphY]*scale_temp,xloc+((i-20)-1)*3,yloc+ydim-d[chart_type_ID][1][0][i-1][100-mousegraphY]*scale_temp);
        
        stroke(0,0,0);
        line(xloc+(i-20)*3,yloc+ydim-d[3][0][0][i][100-mousegraphY]*scale_temp,xloc+((i-20)-1)*3,yloc+ydim-d[3][0][0][i-1][100-mousegraphY]*scale_temp);
     
      }
    }
    
  }
  */
}


function mouseClicked() {
  
  if(mouseX>graph_start_x && mouseX<graph_start_x+distribution_image_size && mouseY>graph_start_y && mouseY<graph_start_y+distribution_image_size){
  
   //  if (locked) {
    //   locked=false;
   //  } else {
      locked=true;
      locked_mouseX=mouseX;
      locked_mouseY=mouseY;
   //  }
  
  }else if(mouseX>510 && mouseX<510+120 && mouseY>630 && mouseY<630+20 ){
    // rect(510,630,120,20);
    if(current_array_type_ID!=3){
      if(current_high_low==1){
        current_high_low=0;
        current_dist=d[current_array_type_ID][current_high_low];
      }else{
        
       current_high_low=1;
       current_dist=d[current_array_type_ID][current_high_low];
        
      }
    }else{
      current_high_low=0;
      current_dist=d[current_array_type_ID][current_high_low];
    }
    
  }else if(mouseX>500 && mouseX<500+120 && mouseY>530 && mouseY<530+20 ){
      current_array_type_ID=2;
      current_dist=d[current_array_type_ID][current_high_low];
  }else if(mouseX>500 && mouseX<500+120 && mouseY>550 && mouseY<550+20 ){
      current_array_type_ID=1;
      current_dist=d[current_array_type_ID][current_high_low];
  }else if(mouseX>500 && mouseX<500+120 && mouseY>570 && mouseY<570+20 ){
    // rect(500,530,120,20)
      current_array_type_ID=0;
      current_dist=d[current_array_type_ID][current_high_low];
    
    
  }else if(mouseX>500 && mouseX<500+120 && mouseY>590 && mouseY<590+20 ){
    // rect(500,530,120,20)
      current_array_type_ID=3;
      current_high_low=0;
      current_dist=d[current_array_type_ID][current_high_low];
    
    
  }else{
    if(current_smoothed_unsmoothed==0){
      
        // current_smoothed_unsmoothed=1;
        // current_dist=d[current_array_type_ID][current_high_low];
    }else{
        
      //  current_smoothed_unsmoothed=0;
       // current_dist=d[current_array_type_ID][current_high_low];
        
      }
    
  }
  
  
}
