import alertSlice from "./slices/alertSlice";
import reportingModel from "./slices/reportingModelSlice";
import clientModel from "./slices/clientModelSlice";
import globalAssumptionModel from "./slices/globalAssumptionAlice";
import nemoFactorModel from "./slices/nemoFactorSlice";
import resultsClaimsModel from "./slices/resultsClaimsSlice";
import tabModel from "./slices/tabModelSlice";
import riskModeler from "./slices/riskModelerSlice";
import sqlDebugger from "./slices/sqlDebuggerSlice";
import whatIfModel from "./slices/whatIfSlice";
import moduleInfoModel from "./slices/moduleInfoSlice";
import compareImpactModel from "./slices/compareImpactSlice";
import nemoClientModel from "./slices/nemoClientSlice";
import emrModel from "./slices/emrModelSlice";
import stopLoss from "./slices/stopLoss/";
import menu from "@slices/menuToggleSlice";
import profile from "@slices/profile";
import modelOptions from "@slices/modelingOptionsSlice";
const reducers = {
	alertSlice,
	reportingModel,
	clientModel,
	globalAssumptionModel,
	nemoFactorModel,
	resultsClaimsModel,
	tabModel,
	riskModeler,
	sqlDebugger,
	whatIfModel,
	moduleInfoModel,
	compareImpactModel,
	nemoClientModel,
	emrModel,
	stopLoss,
	menu,
	profile,
	modelOptions,
};

export default reducers;
