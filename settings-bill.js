export default function SettingsBill() {

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel; 

    let actionList = [];

    function setSettings (settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = settings.warningLevel;
        criticalLevel = settings.criticalLevel;
    }

    function reset(){
        smsCost = ''; 
        callCost = ''; 
        warningLevel = ''; 
        criticalLevel = '';
        actionList = [];
    

    }

    function getSettings
    () {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }
    function recordAction(action) {
        if (!hasReachedCriticalLevel()) {
            let cost = 0;
            if (action === 'sms'){
                cost = smsCost;
            }
            else if (action === 'call'){
                cost = callCost;
            }

            actionList.push({
                type: action,
                cost,
                timestamp: new Date()
            });
        }
    }

    function actions(){
        return actionList;
    }

    function actionsFor(type){
        const filteredActions = [];

        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // add the action to the list
                filteredActions.push(action);
            }
        }

        return filteredActions;

        
    }

    function getTotal(type) {
        let total = 0;
        
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            if (action.type === type) {
                total += action.cost;
            }
        }
        return total;

      
    }

    function grandTotal() {
        return getTotal('sms') + getTotal('call');
    }

    function totals() {
        let smsTotal = getTotal('sms').toFixed(2)
        let callTotal = getTotal('call').toFixed(2)
        return {
            smsTotal,
            callTotal,
            grandTotal : grandTotal().toFixed(2)
        }
    }

    function hasReachedWarningLevel(){
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel 
            && total < criticalLevel;

        return reachedWarningLevel;
       
    }

    function hasReachedCriticalLevel(){
        const total = grandTotal();
        return total >= criticalLevel;
    }

  function levelsCheck(){
    if(hasReachedCriticalLevel())  {
        return "danger";
    } else if (hasReachedWarningLevel())
    return "warning";
  }
  
 




    return {
        setSettings,
        levelsCheck,
        getSettings,
        reset,
        recordAction,
        actions,
        actionsFor,
        getTotal, // Add getTotal function to the returned object
        grandTotal,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel
    }
}