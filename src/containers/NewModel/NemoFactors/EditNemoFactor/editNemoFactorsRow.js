import { Button, Grid, makeStyles } from "@material-ui/core";
import {
  getServiceCategoryAction,
  nemoFactorModelState,
  resetStoreNemoFactorStatusAction,
  saveUsedNemoFactorAction,
  storeNemoFactorAction,
} from "@slices/nemoFactorSlice";

import {
  calculateSavingsAction,
  recalculateSavingsAction,
  riskModelerState,
} from "@slices/riskModelerSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import commons from "@constants/common";
import NemoSkeleton from "@components/NemoSkeleton";
import NemoNumberField from "src/shared/NemoNumberField";

import styles from "./editnemofactor.module.scss";
import { updateTabEdited } from "@slices/tabModelSlice";
import {useRouter} from "next/router";

const { SUCCESS, PENDING, FAILURE, REQUEST } = commons;

const useStyles = makeStyles((theme) => ({
  whiteButton: {
    marginLeft: 15,
  },
  whiteText: {
    color: "#FFF",
    fontWeight: 500,
  },
}));

const EditNemoFactorsRow = ({ data, tabIndex, onCancel }) => {
  // const theme = useTheme();
  const router=useRouter();
  const classes = useStyles();
  const dispatch = useDispatch();
  // const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const { nemoFactorName = "", id: nemoFactorId } = data;

  const {
    serviceCategories,
    serviceCategoriesResStatus,
    usedNemoFactor,
    storeNemoFactorResStatus,
    storeNemoFactorListResStatus
  } = useSelector(nemoFactorModelState);
  const { savedModel } = useSelector(riskModelerState);

  const defaultSelectedIntensity =
    data.intensity.charAt(0).toUpperCase() + data.intensity.slice(1);
  const [nemoFactorIntensity, setNemoFactorIntensity] = useState(
    defaultSelectedIntensity
  );
  const [serviceCategoryData, setServiceCategoryData] = useState([]);
  const [saveServiceCategoryData, setSaveServiceCategoryData] = useState([]);
  const [changedServiceCategories, setChangedServiceCategories] = useState({});
  const [previouslySelectedIntensity, setPreviousIntensity] =
    useState(nemoFactorIntensity);
  const [isCustom, setIsCustom] = useState(false);

  useEffect(() => {
    setNemoFactorIntensity(defaultSelectedIntensity);
  }, [defaultSelectedIntensity]);

  const handleModalClose = () => {
    dispatch(recalculateSavingsAction());
    dispatch(resetStoreNemoFactorStatusAction());
    // setModalOpen(false);
  };

  const handleModalApply = () => {
    if (saveServiceCategoryData.length > 0) {
      const payload = {
        modelId: savedModel.modelId,
        nemoFactorId: nemoFactorId,
        currentlySelectedIntensity: nemoFactorIntensity,
        previouslySelectedIntensity: previouslySelectedIntensity,
        data: saveServiceCategoryData,
      };
      dispatch(storeNemoFactorAction(payload));
      /* check selected state */
      const newUsedNemoFactorState = {
        ...usedNemoFactor,
        [nemoFactorId]: {
          ...data,
          intensity: nemoFactorIntensity,
          isSelected: true,
        },
      };
      dispatch(saveUsedNemoFactorAction(newUsedNemoFactorState));
      dispatch(updateTabEdited(tabIndex));
      dispatch(calculateSavingsAction({ modelId: router.query?.modelid }));
      serviceCategoriesResStatus === SUCCESS && onCancel();
    }
  };

  const handleNemoFactorIntensityChange = (event) => {
    if (event.target.value !== "Custom") {
      setIsCustom(false);
      setChangedServiceCategories({}); // reset changed factors
      setNemoFactorIntensity(event.target.value);
      setPreviousIntensity(event.target.value);
    }
  };

  //need to wait to complete the save api Race condition occurred in previous approach
  const fetchStoreCategories = () => {
    const { id } = data;
    const payload = {
      modelId: savedModel.modelId,
      nemoFactorId: id,
      intensity: nemoFactorIntensity,
    };
    setServiceCategoryData([]); // reset data;
    dispatch(getServiceCategoryAction(payload));
  }
  useEffect(() => {
    if (!isCustom) {
      fetchStoreCategories();
    }
  }, [nemoFactorIntensity]);

  useEffect(() => {
    if(storeNemoFactorListResStatus === SUCCESS) {
      fetchStoreCategories();
    }
  },[storeNemoFactorListResStatus])

  useEffect(() => {
    if (serviceCategories.hasOwnProperty(nemoFactorId)) {
      if (serviceCategories[nemoFactorId].hasOwnProperty(nemoFactorIntensity)) {
        const rawServiceCategoryData =
          serviceCategories[nemoFactorId][nemoFactorIntensity];
        const initialServiceCategoryData = []; // using array to preserve order
        /* prepare initial data for table */
        rawServiceCategoryData.map((rawServiceCategory, index) => {
          const { serviceCategory2Name, serviceCategory2Id, factor } =
            rawServiceCategory;
          const data = {
            serviceCategory2Id,
            serviceCategory2Name,
            nemoFactor: factor,
          };
          initialServiceCategoryData.push(data);
        });
        setServiceCategoryData(initialServiceCategoryData);
      }
    }
  }, [serviceCategories]);

  /* initialize updatedServiceCategoryData */
  useEffect(() => {
    if (serviceCategoryData.length > 0) {
      let allData = [];
      serviceCategoryData.map((category, index) => {
        const usedData = {
          modelId: savedModel.modelId,
          nemoFactorId,
          intensity: nemoFactorIntensity,
          serviceCategory2Id: category.serviceCategory2Id,
          value: parseFloat(Number(category.nemoFactor).toFixed(2)),
        };
        allData.push(usedData);
      });
      setSaveServiceCategoryData(allData);
    }
  }, [serviceCategoryData]);

  const handleNemoFactorChange = (inputValue, id) => {
    // /* search for existing data */
    const indexToUpdate = saveServiceCategoryData.findIndex(
      (serviceCategory, index) => {
        return serviceCategory.serviceCategory2Id === id;
      }
    );

    let temporaryData = JSON.parse(JSON.stringify(saveServiceCategoryData));
    if (indexToUpdate !== -1) {
      const oldData = temporaryData[indexToUpdate];
      temporaryData[indexToUpdate] = { ...oldData, value: inputValue };
    }

    const originalData = parseFloat(
      Number(serviceCategoryData[indexToUpdate]?.nemoFactor)
    ).toFixed(2);
    const newData = temporaryData[indexToUpdate]?.value;

    // 

    if (originalData != newData) {
      /* update intensity to custom */
      setIsCustom(true);
      temporaryData[indexToUpdate] = {
        ...temporaryData[indexToUpdate],
        intensity: "Custom",
      };

      setChangedServiceCategories({
        ...changedServiceCategories,
        [temporaryData[indexToUpdate].nemoFactor]: temporaryData[indexToUpdate],
      });
    } else {
      let tempChangedServiceCategories = JSON.parse(
        JSON.stringify(changedServiceCategories)
      );
      delete tempChangedServiceCategories[
        temporaryData[indexToUpdate].nemoFactor
      ];
      setChangedServiceCategories(tempChangedServiceCategories);
    }

    setSaveServiceCategoryData(temporaryData);
  };

  useEffect(() => {
    /* detect factor changes */
    if (Object.keys(changedServiceCategories).length) {
      setNemoFactorIntensity("Custom");
    } else {
      if (nemoFactorIntensity == "Custom") {
        setNemoFactorIntensity(previouslySelectedIntensity);
      }
    }
  }, [changedServiceCategories]);

  // useEffect(() => {
  //   if (storeNemoFactorResStatus === SUCCESS) {
  //     //  handleModalClose();
  //   }
  // }, [storeNemoFactorResStatus]);
  return (
    <Grid container spacing={3} className={styles.inputsHolder}>
      {serviceCategoriesResStatus === REQUEST &&
        Array.apply(null, Array(12)).map(() => (
          <Grid item xs={3} className={styles.inputFrame}>
            <NemoSkeleton count={1} height={34} />
          </Grid>
        ))}
      {serviceCategoriesResStatus === SUCCESS && !!serviceCategoryData && (
        <React.Fragment>
          {serviceCategoryData.map((serviceCategory, index) => {
            const { serviceCategory2Id, serviceCategory2Name, nemoFactor } =
              serviceCategory;
            return (
              <Grid item xs={6} md={4} lg={3}  className={styles.inputFrame} key={index}>
                <div class={styles.inputLabel}>{serviceCategory2Name}</div>
                <NemoNumberField
                  start={nemoFactor}
                  value={nemoFactor}
                  id={serviceCategory2Id}
                  callback={handleNemoFactorChange}
                  type="decimal"
                  factor={0.1}
                />
              </Grid>
            );
          })}
          <div className={styles.nemoFactorButtonsHolder}>
            <Button variant="outlined" color="secondary" onClick={onCancel}>
              Cancel
            </Button>
            <Button
              variant="contained"
              color="secondary"
              className={classes.whiteButton}
              onClick={handleModalApply}
            >
              <strong className={classes.whiteText}>Save</strong>
            </Button>
          </div>
        </React.Fragment>
      )}
    </Grid>
  );
};

export default EditNemoFactorsRow;
