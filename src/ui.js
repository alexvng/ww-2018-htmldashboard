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
        goalSpd: document.getElementById('goalSpeed')
    },
    pid:{
        p_display: document.getElementById('Ptxt'),
        i_display: document.getElementById('Itxt'),
        d_display: document.getElementById('Dtxt')

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

    let updateShtrSpeed = (key, value) => {
        ui.shooter.speedtxt.innerHTML = value;
    };
    NetworkTables.addKeyListener('/SmartDashboard/speed', updateShtrSpeed);

    NetworkTables.addKeyListener('/robot/time', (key, value) => {
        // This is an example of how a dashboard could display the remaining time in a match.
        // We assume here that value is an integer representing the number of seconds left.
        ui.timer.innerHTML = value < 0 ? '0:00' : Math.floor(value / 60) + ':' + (value % 60 < 10 ? '0' : '') + value % 60;
    });



///BUTTON CLICKS

    ui.gyro.container.onclick = function() {
        // Store previous gyro val, will now be subtracted from val for callibration
        ui.gyro.offset = ui.gyro.val;
        // Trigger the gyro to recalculate value.
        updateGyro('/SmartDashboard/drive/navx/yaw', ui.gyro.val);
    };
    ui.shooter.goalSpd.onchange = function(){
       NetworkTables.putValue('/SmartDashboard/targetSpeed', ui.shooter.goalSpd.value);
       document.getElementById('desiredSpeedTxt').innerHTML = ui.shooter.goalSpd.value;

    };

    ui.auto.button.onclick = function(){

        var selectedAuto;
        var radios = document.getElementsByName('auto_type');
        for (var i = 0, length = radios.length; i < length; i++){
            if(radios[i].checked){
                selectedAuto = radios[i].value;
                break;
            }
        }

        console.log(selectedAuto);
        ui.auto.auto_display.innerHTML = document.getElementById(selectedAuto).innerHTML;
        NetworkTables.putValue('SmartDashboard/auto_selected', selectedAuto);

        return false;
    };
  
addEventListener('error',(ev)=>{
    ipc.send('windowError',{mesg:ev.message,file:ev.filename,lineNumber:ev.lineno})
})