
var v;
var first_vals;
var last_vals;
var file_properties;
var image_files;
var histogram_images;
var current_image;
var  bp_types;
var  smoothed_unsmoothed;
var  age_groups;

var   num_bp_types;
var   num_smoothed_unsmoothed;
var   num_age_groups;

var  current_bp_type;
var  current_smoothed_unsmoothed;
var  current_age_group;

var imagewidth;
var imageheight;
var imagestartx;
var imagestarty;

var current_image;
var current_smoothed_image;
var current_nonsmoothed_image;

var overall_max_count;
var overall_max_prob;

var normalise_distributions;

var min_number_of_vals; // how many values must there be in order to draw the histogram

var total_obs;

var age_group_names;

let age_selector;
let bp_type_selector;
let smooth_selector;


let bp_locked;
let locked_bp_mouseX;


function setup() {
  var canvas =createCanvas(1280, 720);

   canvas.parent('sketch-holder');
  load_data();
  load_histograms();
  canvas.smooth();
  // createCanvas(1280, 720);
  current_image=0;
  current_bp_type=0;
  current_smoothed_unsmoothed=1;
  current_age_group=0;
  
  bp_locked=false;
  locked_bp_mouseX=0;
  
  imagewidth=400;
  imageheight=400;
  imagestartx=70;
  imagestarty=50;
  
  cum_prob_start_x=550 ;
  cum_prob_start_y=200 ;
  cum_prob_width=600 ;
  cum_prob_height=400 ; 
  
  current_image=which_image(current_bp_type,current_smoothed_unsmoothed,current_age_group);
  current_smoothed_image=which_image(current_bp_type,1,current_age_group);
  current_nonsmoothed_image=which_image(current_bp_type,0,current_age_group);
  
  overall_max_count=get_overall_max_count();
  overall_max_prob=get_overall_max_prob();
  
  normalise_distributions=true;
  min_number_of_vals=20;
  total_obs=count_obs();
  

  age_selector = createSelect();
  age_selector.parent('sketch-holder');
  age_selector.position(870,52);
  age_selector.style('position', 'relative');

  
  for(let a=0;a<age_group_names.length;a++){
    age_selector.option(age_group_names[a]);
  }
  age_selector.changed(select_age);
  
  
  bp_type_selector = createSelect();
  bp_type_selector.position(870,72,'relative');
  
  for(let t=0;t<bp_types.length;t++){
    bp_type_selector.option(bp_types[t]);
  }
  bp_type_selector.changed(select_bp_type);
  bp_type_selector.parent('sketch-holder');

  
}



function select_age(){
  let ag = age_selector.value();
  for(let a=0;a<age_group_names.length;a++){
    if(ag==age_group_names[a]){
      current_age_group=a;
    }
  }
  update_after_user_input();
}

function select_bp_type(){
  let bt = bp_type_selector.value();
  for(let t=0;t<bp_types.length;t++){
    if(bt==bp_types[t]){
      current_bp_type=t;
    }
  }
  update_after_user_input();
}


function draw() {
background(255);

  stroke(255);
  fill(255);
  rect(0,0,1280,720);
  stroke(0);
  // rect(0,0,1279,719);

  
  // show the image and a rectangle around it
  
  image(histogram_images[current_image], imagestartx, imagestarty);
  noFill();
  stroke(0);
  rect(imagestartx, imagestarty,imagewidth,imageheight);

  
  stroke(0);
  fill(240);
  // show the lower distribution
  rect(imagestartx, imagestarty+imageheight+50,imagewidth,200);
  
  
  // show the right distribution
  // rect(imagestartx+imagewidth+50, imagestarty,200,imageheight);
  
  
  
  stroke(0,0,0);
  for (let i=0;i<=10;i++){
    line(imagestartx+i*40,imagestarty,imagestartx+i*40,imagestarty-5);
    line(imagestartx+i*40,imagestarty+imageheight+250,imagestartx+i*40,imagestarty+imageheight+250+5);
    line(imagestartx, imagestarty+i*40   ,imagestartx-5,imagestarty+i*40  );
    // line(imagestartx+imagewidth+250, imagestarty+i*40   ,imagestartx+imagewidth+250+5,imagestarty+i*40  );

  }
  


  
  stroke(200);
  for (let i=1;i<=9;i++){
     line(imagestartx+i*40,imagestarty,imagestartx+i*40,imagestarty+imageheight);
     line(imagestartx+i*40,imagestarty+imageheight+250,imagestartx+i*40,imagestarty+imageheight+250-200);
    
      line(imagestartx, imagestarty+i*40   ,imagestartx+imagewidth,imagestarty+i*40  );
     // line(imagestartx+imagewidth+250, imagestarty+i*40   ,imagestartx+imagewidth+50,imagestarty+i*40  );
    
  }
  
  stroke(0);
  fill(0);
  for (let i=0;i<=10;i++){
      textAlign(CENTER, BOTTOM);
      text(i*20,imagestartx+i*40,45);
      text(i*20,imagestartx+i*40,imagestarty+imageheight+270);
      textAlign(RIGHT, BOTTOM);
      text((10-i)*20,60,imagestarty+i*40+6);  
      // textAlign(LEFT, BOTTOM);
      // text((10-i)*20,imagestarty+imagewidth+280,imagestarty+i*40+6);
  }
  textAlign(LEFT, BOTTOM);
  
  stroke(0);
  noFill();
  // show the lower distribution
  rect(imagestartx, imagestarty+imageheight+50,imagewidth,200);
  
  
  // show the right distribution
  // rect(imagestartx+imagewidth+50, imagestarty,200,imageheight);
  
    stroke(200);
   line(imagestartx,imagestarty+imageheight,imagestartx+imagewidth,imagestarty);   // idagonal line
   
   
   // cumulitive probability container
    stroke(0,0,0);
    noFill();
    // rect(cum_prob_start_x,cum_prob_start_y,cum_prob_width,cum_prob_height);
    for (let i=0;i<=10;i++){
        textAlign(CENTER, BOTTOM);
        text(i*20,cum_prob_start_x+i*cum_prob_width/10,cum_prob_start_y+cum_prob_height+20);
        line(cum_prob_start_x+i*cum_prob_width/10,cum_prob_start_y+cum_prob_height,cum_prob_start_x+i*cum_prob_width/10,cum_prob_start_y+cum_prob_height+5);
        // text(i*20,cum_prob_start_x+i*40,cum_prob_start_y+cum_prob_height+270);
       
        textAlign(RIGHT, BOTTOM);
        text(((10-i)*10)+"%",cum_prob_start_x-10,cum_prob_start_y+i*40+6);  
        line(cum_prob_start_x,cum_prob_start_y+i*cum_prob_height/10,cum_prob_start_x-5,cum_prob_start_y+i*cum_prob_height/10);  
        // textAlign(LEFT, BOTTOM);
        // text((10-i)*20,imagestarty+imagewidth+280,imagestarty+i*40+6);
    }
    textAlign(LEFT, BOTTOM);
    
    stroke(200,200,200);
    for (let i=0;i<=10;i++){

        line(cum_prob_start_x+i*60,cum_prob_start_y+cum_prob_height,cum_prob_start_x+i*60,cum_prob_start_y);

        line(cum_prob_start_x,cum_prob_start_y+i*40,cum_prob_start_x+cum_prob_width,cum_prob_start_y+i*40);  
    }
    stroke(0,0,0);
    noFill();
    rect(cum_prob_start_x,cum_prob_start_y,cum_prob_width,cum_prob_height);
  
  
  // stroke(200,0,0);
  stroke(68,188,157);
  bp_test=0;
  if(mouse_in_image() ||       bp_locked){
    
    if(bp_locked){
      line(locked_bp_mouseX,imagestarty,locked_bp_mouseX,imagestarty+imageheight);
      line(locked_bp_mouseX,imagestarty+imageheight+250,locked_bp_mouseX,imagestarty+imageheight+50);
      bp1=floor((locked_bp_mouseX-imagestartx)/2);
    // line(imagestartx,mouseY,imagestartx+imagewidth,mouseY);
    }else{
      line(mouseX,imagestarty,mouseX,imagestarty+imageheight);
      line(mouseX,imagestarty+imageheight+250,mouseX,imagestarty+imageheight+50);
      bp1=floor((mouseX-imagestartx)/2);
    }
    
    // bp1=floor((mouseX-imagestartx)/2);
    bp2=floor(((imagestarty+imagewidth)-mouseY)/2);
    print(current_image+" "+bp1+" "+bp2+" "+first_vals[current_image][bp2]+" "+last_vals[current_image][bp2]);
    if(normalise_distributions==true){
      maxval_temp=overall_max_prob;
      maxcount_temp=overall_max_count;
    }else{
      maxval_temp=max(v[current_smoothed_image][bp1]);
      maxcount_temp=max(v[current_nonsmoothed_image][bp1]);
      
    }
    

    stroke(100);
    fill(220);
    
    for(let i=first_vals[current_nonsmoothed_image][bp1];i<=last_vals[current_nonsmoothed_image][bp1];i++){
      rect(
       imagestartx+(i)*2,imagestarty+imageheight+250,
        2,-v[current_nonsmoothed_image][bp1][i-first_vals[current_nonsmoothed_image][bp1]]/maxcount_temp*0.9*200
      );
      //print((imagestartx+i*2)+" "+(imagestarty+imageheight+50-v[current_image][bp1][i]/maxval*0.75*200)+" "+(imagestartx+(i+1)*2)+" "+(imagestarty+imageheight+50-v[current_image][bp1][i+1]/maxval*0.75*200));
    }
    
    stroke(0,0,0);
    cumulitive_prob_sum=0;
    cumulitive_prob_count=0;
    for(let i=first_vals[current_smoothed_image][bp1];i<=last_vals[current_smoothed_image][bp1];i++){
      cumulitive_prob_sum+=v[current_smoothed_image][bp1][i-first_vals[current_smoothed_image][bp1]];
      
    }
     for(let j=max(0,bp1-1);j<=min(bp1+1,200);j++){
       for(let i=first_vals[current_nonsmoothed_image][j];i<=last_vals[current_nonsmoothed_image][j];i++){
         
        // for(let i=first_vals[current_nonsmoothed_image][bp1];i<=last_vals[current_nonsmoothed_image][bp1];i++){
        // cumulitive_prob_count+=v[current_nonsmoothed_image][bp1][i-first_vals[current_nonsmoothed_image][bp1]];
         cumulitive_prob_count+=v[current_nonsmoothed_image][j][i-first_vals[current_nonsmoothed_image][j]];
       }
     }
      
      
      last_cumulitive_sum=0;
      fivepc_done=false;
      twentyfivepc_done=false;
      fiftypc_done=false;
      seventyfivepc_done=false;
      ninetyfivepc_done=false;
      fivepc=0;
      twentyfivepc=0;
      fiftypc=0;
      seventyfivepc=0;
      ninetyfivepc=0;  
      
    for(let i=first_vals[current_smoothed_image][bp1];i<=last_vals[current_smoothed_image][bp1];i++){
      line(
       imagestartx+(i)*2,imagestarty+imageheight+250-v[current_smoothed_image][bp1][i-first_vals[current_smoothed_image][bp1]]/maxval_temp*0.9*200,
        imagestartx+(i+1)*2,imagestarty+imageheight+250-v[current_smoothed_image][bp1][i-first_vals[current_smoothed_image][bp1]+1]/maxval_temp*0.9*200
      );
      
      // cumulitive probability line
      // cum_prob_start_x=550 ;
      // cum_prob_start_y=200 ;
      // cum_prob_width=600 ;
      // cum_prob_height=400 ; 
      // line(
      //  cum_prob_start_x+(i)*cum_prob_width/200,cum_prob_start_y+cum_prob_height-v[current_smoothed_image][bp1][i-first_vals[current_smoothed_image][bp1]]/maxval_temp*0.9*200,
      //   cum_prob_start_x+(i+1)*cum_prob_width/200,cum_prob_start_y+cum_prob_height-v[current_smoothed_image][bp1][i-first_vals[current_smoothed_image][bp1]+1]/maxval_temp*0.9*200
      // );  
      
        if(cumulitive_prob_sum>0 && cumulitive_prob_count>80){
          line(
           cum_prob_start_x+(i)*cum_prob_width/200,cum_prob_start_y+cum_prob_height-last_cumulitive_sum/cumulitive_prob_sum*cum_prob_height,
            cum_prob_start_x+(i+1)*cum_prob_width/200,cum_prob_start_y+cum_prob_height-last_cumulitive_sum/cumulitive_prob_sum*cum_prob_height-(v[current_smoothed_image][bp1][i-first_vals[current_smoothed_image][bp1]] )/cumulitive_prob_sum*cum_prob_height
          );  
        
        // stroke(255,100,100);
        stroke(68,188,157);
        if(last_cumulitive_sum/cumulitive_prob_sum>0.05 && fivepc_done==false){
          line(
            cum_prob_start_x+(i+1)*cum_prob_width/200,cum_prob_start_y+cum_prob_height*0.95,
            cum_prob_start_x+cum_prob_width+5,cum_prob_start_y+cum_prob_height*0.95
          );  
          fivepc_done=true;
          fivepc=i;
        }
        if(last_cumulitive_sum/cumulitive_prob_sum>0.25 && twentyfivepc_done==false){
          line(
            cum_prob_start_x+(i+1)*cum_prob_width/200,cum_prob_start_y+cum_prob_height*0.75,
            cum_prob_start_x+cum_prob_width+5,cum_prob_start_y+cum_prob_height*0.75
          );  
          twentyfivepc_done=true;
          twentyfivepc=i;
        }
        if(last_cumulitive_sum/cumulitive_prob_sum>0.5 && fiftypc_done==false){
          line(
            cum_prob_start_x+(i+1)*cum_prob_width/200,cum_prob_start_y+cum_prob_height/2,
            cum_prob_start_x+cum_prob_width+5,cum_prob_start_y+cum_prob_height/2
          );  
          fiftypc_done=true;
          fiftypc=i;
        }
        if(last_cumulitive_sum/cumulitive_prob_sum>0.75 && seventyfivepc_done==false){
          line(
            cum_prob_start_x+(i+1)*cum_prob_width/200,cum_prob_start_y+cum_prob_height*0.25,
            cum_prob_start_x+cum_prob_width+5,cum_prob_start_y+cum_prob_height*0.25
          );  
          seventyfivepc_done=true;
          seventyfivepc=i;
        }
        if(last_cumulitive_sum/cumulitive_prob_sum>0.95 && ninetyfivepc_done==false){
          line(
            cum_prob_start_x+(i+1)*cum_prob_width/200,cum_prob_start_y+cum_prob_height*0.05,
            cum_prob_start_x+cum_prob_width+5,cum_prob_start_y+cum_prob_height*0.05
          );  
          ninetyfivepc_done=true;
          ninetyfivepc=i; 
        }
        stroke(0);
 
        
        
      }
      fill(0);

      
      last_cumulitive_sum+=v[current_smoothed_image][bp1][i-first_vals[current_smoothed_image][bp1]];
      
      
    }
    if(cumulitive_prob_sum>0 && cumulitive_prob_count>80){
      textAlign(LEFT, CENTER);
      text("5% "+fivepc+" mmHg",cum_prob_start_x+cum_prob_width+15,cum_prob_start_y+cum_prob_height*0.95);
      text("25% "+twentyfivepc+" mmHg",cum_prob_start_x+cum_prob_width+15,cum_prob_start_y+cum_prob_height*0.75);
      text("Median "+fiftypc+" mmHg",cum_prob_start_x+cum_prob_width+15,cum_prob_start_y+cum_prob_height*0.5);
      text("75% "+seventyfivepc+" mmHg",cum_prob_start_x+cum_prob_width+15,cum_prob_start_y+cum_prob_height*0.25);
      text("95% "+ninetyfivepc+" mmHg",cum_prob_start_x+cum_prob_width+15,cum_prob_start_y+cum_prob_height*0.05);
    }

    bp_test=bp1;
  }
  
      stroke(0,0,0);
    noFill();
    rect(cum_prob_start_x,cum_prob_start_y,cum_prob_width,cum_prob_height);
  
    fill(0);
    stroke(0);
    textAlign(LEFT, BOTTOM);
    
    // text (cumulitive_prob_count,600,700);
       textSize(16);
       if(current_bp_type==3 && bp_test>0){
         // text(bp_types[current_bp_type]+" - Ages "+age_group_names[current_age_group],600,40); 
         text ("Cumulative Probability - Invasive "+bp_types[current_bp_type]+" given Non-Invasive BP of "+bp1+" mmHg",cum_prob_start_x+20,cum_prob_start_y-10);
       }else if(bp_test>0){
         // text(bp_types[current_bp_type]+" Blood Pressure - Ages "+age_group_names[current_age_group],600,40); 
         text ("Cumulative Probability - Invasive "+bp_types[current_bp_type]+" BP given Non-Invasive BP of "+bp1+" mmHg",cum_prob_start_x+20,cum_prob_start_y-10);
       }else{
         text ("Cumulative Probability",cum_prob_start_x+20,cum_prob_start_y-10);
         
       }
    textAlign(LEFT, BOTTOM);
    
    
  textSize(12);
  
stroke(0);
fill(0);
  text("Age Category: ",780,70);
  text("BP Type: ",780,90);
  text("Total Observations: "+(total_obs),780,130);
  

  age_selector.selected(age_group_names[current_age_group]);
  bp_type_selector.selected(bp_types[current_bp_type]);
    // text("Key Controls",1060,70);
    // text("Toggle Smooth - s",1060,90);
    // text("Change Age Group - a",1060,110);
   //  text("Change BP type - t",1060,130);
  
  // current_image+=1;
  
  text("Non-Invasive Blood Pressure (mmHg) ",150,20);
  
  
   text("Distribution of Invasive Blood Pressures (mmHg) ",130,490); 
 
   
       textSize(24);
       if(current_bp_type==3){
         text(bp_types[current_bp_type]+" - Ages "+age_group_names[current_age_group],600,40); 
       }else{
         text(bp_types[current_bp_type]+" Blood Pressure - Ages "+age_group_names[current_age_group],600,40); 
       }
       textSize(12);
       
       
    translate(30, 320);
    rotate(-PI/2);
    
  
    stroke(0);
    
    text('Invasive Blood Pressure (mmHg)', 0, 0); 
}




function which_image(current_bp_type,current_smoothed_unsmoothed,current_age_group){
  
  for(let i=0;i<104;i++){
    
    if(file_properties[i][0]==bp_types[current_bp_type]){
      if(file_properties[i][1]==smoothed_unsmoothed[current_smoothed_unsmoothed]){
        // print("test age groups "+current_bp_type+" "+current_smoothed_unsmoothed+" "+current_age_group+" "+file_properties[i][1]+" "+age_groups[current_age_group]);
        if(file_properties[i][2]==age_groups[current_age_group]){
          // print("test "+current_bp_type+" "+current_smoothed_unsmoothed+" "+current_age_group+" "+file_properties[i][1]+" "+current_image);
          return i;
        }
      }
    }
  }
  return 0;
  
}

  function get_overall_max_count(){
    m=0;
    for(let i=0;i<200;i++){
      m=max(m,max(v[current_nonsmoothed_image][i]));
    }
    return m;
    
  }
  function get_overall_max_prob(){
    m=0;
    for(let i=0;i<200;i++){
      m=max(m,max(v[current_smoothed_image][i]));
    }
    return m;
  }
  
  function count_obs(){
    c=0;

    for(let i=0;i<200;i++){
       for (j = 0; j < v[current_nonsmoothed_image][i].length; j += 1) {
          c += v[current_nonsmoothed_image][i][j];
    
      }
    }
    return c;
  }



function keyPressed() {
   
     if (key == "s") {
      //  print("test "+current_smoothed_unsmoothed+" "+num_smoothed_unsmoothed);
      if(current_smoothed_unsmoothed<num_smoothed_unsmoothed-1){
        current_smoothed_unsmoothed++;
      }else{
        current_smoothed_unsmoothed=0;
      }
   
    } 
    
     if (key == "t") {
      //  print("test "+current_smoothed_unsmoothed+" "+num_smoothed_unsmoothed);
      if(current_bp_type<num_bp_types-1){
        current_bp_type++;
      }else{
        current_bp_type=0;
      }
   
    } 
    
    if (key == "a") {
      //  print("test "+current_smoothed_unsmoothed+" "+num_smoothed_unsmoothed);
      if(current_age_group<num_age_groups-1){
        current_age_group++;
      }else{
        current_age_group=0;
      }
   
    } 
    
    if (key == "n") {
      //  print("test "+current_smoothed_unsmoothed+" "+num_smoothed_unsmoothed);
      if(normalise_distributions==true){
        normalise_distributions=false;
      }else{
        normalise_distributions=true;
      }
   
    } 
    
    
    
    update_after_user_input();
}

function update_after_user_input(){
  
    current_image=which_image(current_bp_type,current_smoothed_unsmoothed,current_age_group);
    current_smoothed_image=which_image(current_bp_type,1,current_age_group);
    current_nonsmoothed_image=which_image(current_bp_type,0,current_age_group);
    overall_max_count=get_overall_max_count();
    overall_max_prob=get_overall_max_prob();
    total_obs=count_obs();
  
}


function mouse_in_image(x,y){
  
  if(mouseX>imagestartx && mouseX<imagestartx+imagewidth){
    if(mouseY<imagestarty+imageheight && mouseY>imagestarty){
      return true;
    }
  }
  return false;
}


function mouseClicked() {
  if(mouse_in_image(mouseX, mouseY)){
    if(bp_locked){
      bp_locked=false;
      locked_bp_mouseX=0;
    }else{
      bp_locked=true;
      locked_bp_mouseX=mouseX;
    }
    
    
  }

}
