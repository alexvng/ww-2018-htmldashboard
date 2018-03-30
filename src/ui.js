// Define UI elements
let ui = {
    timer: document.getElementById('timer'),
    robotState: document.getElementById('robot-state').firstChild,
    gyro: {
        container: document.getElementById('gyro'),
        val: 0,
        offset: 0,
        visualVal: 0,
        arm: document.getElementById('gyro-arm'),
        number: document.getElementById('gyro-number')
    },
    auto:{
        auto_display: document.getElementById('auto_display'),
        button: document.getElementById('auto_button')
    },
    fms:{
        display: document.getElementById('fms_display')
    },
    shooter:{
        speedtxt: document.getElementById('sht_spd_txt'),
        height_display: document.getElementById('display_shtr_height');
    },
    pid:{
        p_display: document.getElementById('Ptxt'),
        i_display: document.getElementById('Itxt'),
        d_display: document.getElementById('Dtxt')
    }
    boolean:{
        cube: document.getElementById('cubeLoaded'),
        hood: document.getElementById('hoodUp'),
        pickup: document.getElementById('pickupOut')
    }
};

// Key Listeners

// Gyro rotation
    let updateGyro = (key, value) => {
        ui.gyro.val = value;
        ui.gyro.visualVal = Math.floor(ui.gyro.val - ui.gyro.offset);
        ui.gyro.visualVal %= 360;
        if (ui.gyro.visualVal < 0) {
            ui.gyro.visualVal += 360;
        }
        ui.gyro.arm.style.transform = `rotate(${ui.gyro.visualVal}deg)`;
        ui.gyro.number.innerHTML = ui.gyro.visualVal + 'º';
    };
    NetworkTables.addKeyListener('/SmartDashboard/angle', updateGyro);

 //Shooter Speed
    let updateShtrSpeed = (key, value) => {
        ui.shooter.speedtxt.innerHTML = value + " m/s";
    };
    NetworkTables.addKeyListener('/SmartDashboard/speed', updateShtrSpeed);

//Match Time
    NetworkTables.addKeyListener('/robot/time', (key, value) => {
        // This is an example of how a dashboard could display the remaining time in a match.
        // We assume here that value is an integer representing the number of seconds left.
        ui.timer.innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
    });

//Shooter Height 
    let updateShtrHeight = (key, value) =>{
        ui.shooter.height_display.innerHTML = value;
    }
    NetworkTables.addKeyListener('/SmartDashboard/target-selected', updateShtrHeight);

//Booleans
    //cube
    let updateCubeLoaded = (key, value) =>{
        ui.boolean.cube.style = (value == true)? "height:20px; background-color:green" : "height:20px; background-color:red";
    }
    NetworkTables.addKeyListener('/SmartDashboard/cube-loaded', updateCubeLoaded);
    //Hood 
    let updateHoodUp = (key, value) =>{
        ui.boolean.hood.style = (value == true)? "height:20px; background-color:green" : "height:20px; background-color:red";
    }
    NetworkTables.addKeyListener('/SmartDashboard/hood-up', updateHoodUp);
    //PickUp 
    let updatePickUpOut = (key, value)=>{
        ui.boolean.pickup.style = (value == true)? "height:20px; background-color:green" : "height:20px; background-color:red";
    }
    NetworkTables.addKeyListener('/SmartDashboard/pickup-out', updatePickUpOut);
///BUTTON CLICKS

//Gyro Re-Calibratae
    ui.gyro.container.onclick = function() {
        // Store previous gyro val, will now be subtracted from val for callibration
        ui.gyro.offset = ui.gyro.val;
        // Trigger the gyro to recalculate value.
        updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
    };

//Set Auto
    ui.auto.button.onclick = function(){
        var e = document.getElementById("startPos");
        var startPosition = e.options[e.selectedIndex];
        e = document.getElementById("target");
        var targetPosition = e.options[e.selectedIndex];
        var selectedAuto = startPosition.value + targetPosition.value;

        console.log(selectedAuto);
        ui.auto.auto_display.innerHTML = startPosition.text + " " + targetPosition.text;
        NetworkTables.putValue('SmartDashboard/auto_selected', selectedAuto);

        return false;
    };
  



//MISCELALLNEOUS
function IgnoreAlpha(e)
{
    if (!e)
    {
        e = window.event ;
    }
    if (e.keyCode >= 30 && e.keyCode <= 90) // A to Z
    {
        e.returnValue=false;
        e.cancel = true;
    }
}

addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
})