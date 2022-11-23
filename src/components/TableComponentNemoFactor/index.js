import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import Paper from '@material-ui/core/Paper';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableFooter from '@material-ui/core/TableFooter';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import Alert from '@material-ui/lab/Alert';
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Favorite from '@material-ui/icons/Favorite';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import clsx from 'clsx';
import Icon from "@material-ui/core/Icon";
import Box from '@material-ui/core/Box';
import React, { useState, useEffect } from 'react';
import LinearProgressBar from '@components/LinearProgressBar';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  textComponent: {
    fontSize: '14px',
    lineHeight: '17px',
    color: '#3D3E64',
    fontWeight: 600
  },
  tagComponent: {
    background: 'rgba(150, 167, 235, 0.1)',
    borderRadius: '6px',
    lineHeight: '0.5em',
    width: 'fit-content'
  },
  populationContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignContent: 'flex-start'
  },
  actionButton: {
    marginRight: '5px',
    borderRadius: '20px',
    border: '1px solid #000000',
    minWidth: '70px !important'
  },
  links: {
    textDecoration: 'none !important',
    color: 'unset !important'
  },
  headerTitle: {
    fontSize: '14px',
    lineHeight: '17px',
    color: '#3D3E64',
    fontWeight: 600
  },
  headerRowTitle: {
    fontSize: '14px',
    lineHeight: '17px',
    color: '#3D3E64'
  },
  inputStyle: {
    border: '1px solid',
    background: '#EFEFF0',
    borderRadius: '7px !important',
    paddingLeft: '10px'
  },
});

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const NemoFactorEditComponent = (props) => {
  const { children } = props;
  const { id, dataid } = children.props;

  useEffect(() => {
    // hide input component
  }, [])

  const handleClick = (inputId) => {
    const editBtnId = document.getElementById(id);
    const elementId = document.getElementById(inputId);
    const childrenElem = elementId.children[0];
    const inputElementId = document.getElementById("input" + inputId);
    if (editBtnId.textContent === "Edit") {
      elementId.setAttribute("style", "display: unset !important");
      inputElementId.removeAttribute("readonly");
      if (childrenElem.hasAttribute('old-style')) {
        const oldStyle = childrenElem.getAttribute('old-style');
        childrenElem.setAttribute("style", oldStyle);
      }
      editBtnId.textContent = "Save";
      editBtnId.setAttribute('style', 'background: #42DEB4;')
    } else {
      inputElementId.setAttribute("readonly", "true");
      const oldStyle = childrenElem.getAttribute('style');
      childrenElem.setAttribute('old-style', oldStyle);
      childrenElem.setAttribute('style', oldStyle + "border: unset !important; background: unset !important");
      editBtnId.textContent = "Edit";
      editBtnId.removeAttribute('style');
    }
  }

  return (
    <span onClick={() => handleClick(dataid)}>
      {children}
    </span>
  );
}

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const { count, page, rowsPerPage, onChangePage } = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton onClick={handleBackButtonClick} disabled={page === 0} aria-label="previous page">
        {theme.direction === 'rtl' ? <KeyboardArrowRight /> : <KeyboardArrowLeft />}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === 'rtl' ? <KeyboardArrowLeft /> : <KeyboardArrowRight />}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}


const RenderTableComponent = (props) => {
  const classes = useStyles();

  const { headers, data, actions, options, initialState } = props.tableProps;
  const { callback } = props;

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(options.rowsPerPage);
  const [order, setOrder] = React.useState('asc');

  const defaultOrderBy = Object.keys(data[0])[0];
  const [orderBy, setOrderBy] = React.useState(defaultOrderBy);

  const newKeys = headers.reduce((acc, value) => {
    if (value.hasOwnProperty("newKey")) {
      acc.push(value);
    }
    return acc;
  }, []);

  // const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.name);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);


  const DefaultComponent = function TextComponent({ children }) {
    return children;
  }

  const TextComponent = function TextComponent({ children }) {
    return <span className={classes.textComponent}>{children}</span>;
  }

  const TagComponent = function TagComponent({ children }) {
    return (
      <Alert icon={false} severity="success" className={classes.tagComponent}>
        {children}
      </Alert>
    )
  }

  const PopulationComponent = function PopulationComponent({ children }) {
    const population = Number(children);
    const populationInK = population / 1000 + 'k';

    return (
      <span className={classes.populationContainer}>

        <img
          src="/human.svg"
          alt="human image"
        />
        <span className={classes.textComponent}>{populationInK}</span>
      </span>
    );
  }

  const CurrencyComponent = function CurrencyComponent({ children }) {
    const amount = Number(children).toFixed(2);
    const amountWithCommas = amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return (
      <span className={classes.textComponent}>${amountWithCommas}</span>
    );
  }

  const RouteComponent = function RouteComponent({ rowData, data, children }) {
    const { href, params } = data;
    let paramsObj = {};
    params.forEach((parameter, index) => {
      paramsObj[parameter] = rowData[parameter];
    })
    const urlParams = new URLSearchParams(paramsObj);
    return (
      <Link href={href + '?' + urlParams} className={classes.links}>
        {children}
      </Link>
    )
  }

  const InputComponent = function InputComponent(props) {
    const { id, value, width } = props;
    return (
      <Box component="div" id={id}>
        <TextField id={"input" + id} InputProps={{ 'aria-label': 'model name', disableUnderline: true }}
          name={id}
          value={value}
          style={{ width: width }}
          classes={{ root: classes.inputStyle }}
        />
      </Box>
    );
  }

  const getRenderer = (componentName) => {
    switch (componentName) {
      case 'TextComponent':
        return TextComponent;
      case 'TagComponent':
        return TagComponent;
      case 'PopulationComponent':
        return PopulationComponent;
      case 'CurrencyComponent':
        return CurrencyComponent;
      case 'InputComponent':
        return InputComponent;
      case 'DefaultComponent':
        return DefaultComponent;
      default:
        return null;
    }
  }

  const getActionRenderer = (actionData) => {
    const renderer = actionData ? actionData.component ? actionData.component : 'DefaultComponent' : null;

    switch (renderer) {
      case 'RouteComponent':
        return RouteComponent;
      case 'DefaultComponent':
        return DefaultComponent;
      // component specific
      case 'NemoFactorEditComponent':
        return NemoFactorEditComponent;
      default:
        return null;
    }
  }

  let paginationColspan = 1;
  if (headers) {
    paginationColspan = actions ? headers.length + 1 : headers.length;
  }

  const displayData = stableSort(data, getComparator(order, orderBy))
    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const prepareIdAttribute = (attributes, row, prefix) => {
    let newAttributes = JSON.parse(JSON.stringify(attributes));

    const getIdStr = (idStr) => {
      // find id of the value to be found
      const matches = idStr.matchAll(/##(.*?)##/g);
      const ids = Array.from(matches, x => x[1])
      ids.map((idToReplace, index) => {
        idStr = idStr.replaceAll("##" + idToReplace + "##", row[idToReplace])
      });
      return idStr;
    }

    if (newAttributes.hasOwnProperty("id")) {
      let idStr = newAttributes.id;
      const prefixValue = prefix ? prefix : "";
      newAttributes.id = prefixValue + getIdStr(idStr);
    }

    if (newAttributes.hasOwnProperty("dataid")) {
      let idStr = newAttributes.dataid;
      newAttributes.dataid = getIdStr(idStr);
    }

    return newAttributes;
  }

  const CustomCheckBoxIcon = () => (
    <Icon>
      <img alt="checkbox icon" src="/check-box-icon.svg" />
    </Icon>
  );

  const CustomCheckBoxOutlineBlankIcon = () => (
    <Icon>
      <img alt="checkbox marked icon" src="/check-box-icon-checked.svg" />
    </Icon>
  );

  const [checkboxState, setCheckboxState] = useState({});
  const [inputState, setInputState] = useState({});
  const [editState, setEditState] = useState({});

  const checkboxRootId = "nemoFactorCheckAll";

  useEffect(() => {

    const oldCheckboxState = {};
    const oldInputboxState = {};
    Object.keys(initialState).forEach((uniqueId, index) => {
      oldCheckboxState[uniqueId] = true;
      oldInputboxState[uniqueId] = { value: initialState[uniqueId].futureFactor, display: 'block', readonly: true, style: { border: 'unset', background: 'unset' } }
    });

    /* check all bind action */
    // initialize checkbox and inputbox
    let initialCheckboxState = oldCheckboxState;
    let initialInputboxState = oldInputboxState;
    let initializeEditState = {};
    displayData.map((d, index) => {
      const uniqueKey = d.id;
      if (!Object.keys(initialState).includes(uniqueKey)) { // only initialize default if it has no previous value
        initialCheckboxState = ({ ...initialCheckboxState, [uniqueKey]: false })
        initialInputboxState = ({ ...initialInputboxState, [uniqueKey]: { display: 'none', value: "", readonly: true, style: {} } })
      }
      initializeEditState = ({ ...initializeEditState, [uniqueKey]: { value: "Edit", style: {} } })
    });
    setCheckboxState(initialCheckboxState);
    setInputState(initialInputboxState);
    setEditState(initializeEditState);

  }, [])

  const toggleRootCheckbox = function (e) {
    const newStatus = e.target.checked;
    let initialCheckboxState = {};
    displayData.map((d, index) => {
      const uniqueKey = d.id;
      initialCheckboxState = ({ ...initialCheckboxState, [uniqueKey]: newStatus });
    });
    setCheckboxState(initialCheckboxState);
  }

  const handleCheckboxChange = (e) => {
    const checkboxName = e.target.name;
    setCheckboxState({ ...checkboxState, [checkboxName]: !checkboxState[checkboxName] });
  }

  const handleEditClick = (uniqueId) => {
    const prevInputState = inputState[uniqueId];
    const prevEditState = editState[uniqueId];
    const { value } = prevEditState;
    const inputValue = prevInputState.value;

    if (value === 'Edit') {
      setInputState({ ...inputState, [uniqueId]: { ...prevInputState, display: 'block', readonly: false, style: {} } });
      setEditState({ ...editState, [uniqueId]: { value: 'Save', style: { background: '#42DEB4' } } })
    } else if (value === 'Save') {
      setInputState({ ...inputState, [uniqueId]: { ...prevInputState, display: 'block', readonly: true, style: { border: 'unset', background: 'unset' } } });
      setEditState({ ...editState, [uniqueId]: { value: 'Edit', style: {} } })
      if (inputValue) {
        setCheckboxState({ ...checkboxState, [uniqueId]: true });
      }
    }
  }

  const handleInputChange = (e) => {
    const uniqueId = e.target.name;
    const prevInputState = inputState[uniqueId];
    setInputState({ ...inputState, [uniqueId]: { ...prevInputState, value: e.target.value } });
  }

  useEffect(() => {
    // selected items value
    const checkedKeys = Object.keys(checkboxState).filter((key) => checkboxState[key] === true);
    let data = {};
    checkedKeys.forEach((key, index) => {
      const filteredRow = displayData.filter((row, index) => row.id === key)[0];
      const inputValue = inputState[key].value;
      data = {
        ...data, [key]: {
          nemoFactor: inputValue ? inputValue : filteredRow.value,
          futureFactor: inputValue
        }
      }
    })

    callback(data); // set used nemo factor into parent state

  }, [checkboxState])

  return (
    <TableContainer component={Paper} elevation={0}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((column, index) => {
              if (index === 0) {
                return (
                  <TableCell align={'left'} key={index}>
                    <FormControlLabel
                      control={<Checkbox icon={<CustomCheckBoxOutlineBlankIcon />} checkedIcon={<CustomCheckBoxIcon />}
                        name={checkboxRootId} id={checkboxRootId} onChange={(e) => toggleRootCheckbox(e)} />}
                      label={<span className={classes.headerTitle}>NEMO Factors</span>}
                    />
                  </TableCell>)
              } else {
                return (<TableCell align={'right'} key={index}>{column.name}</TableCell>)
              }
            }
            )}
            <TableCell align={'right'} >Future Factor</TableCell>
            <TableCell align={'right'} ><Box display="none">ACTION</Box></TableCell>

          </TableRow>
        </TableHead>
        <TableBody>
          {displayData.map((row, index) => {
            let firstCol = -1;
            const uniqueKey = row.id;
            return (
              <TableRow key={index}>
                {headers.map((header, headerIndex) => {
                  let rowValue = "";
                  if (header.hasOwnProperty('sourceKey')) {
                    const rowKey = header.sourceKey;
                    rowValue = row[rowKey] ? row[rowKey] : "";
                  }
                  if (header.hasOwnProperty('defaultValue')) {
                    rowValue = header.defaultValue;
                  }
                  let attributes = header.hasOwnProperty("attributes") ? header.attributes : {};
                  // prepare id: parse id value
                  attributes = prepareIdAttribute(attributes, row);

                  const Renderer = getRenderer(header.component);
                  const key = index + "_" + headerIndex;
                  Renderer && firstCol++;
                  if (firstCol === 0) {
                    return Renderer && (
                      <TableCell component='td' scope="row" key={key} align={'left'} >
                        <Renderer {...attributes}>
                          <FormControlLabel
                            control={<Checkbox icon={<CustomCheckBoxOutlineBlankIcon />} checkedIcon={<CustomCheckBoxIcon />}
                              name={uniqueKey} onChange={(e) => handleCheckboxChange(e)} checked={checkboxState[uniqueKey]} />}
                            label={<span className={classes.headerRowTitle}> {rowValue}</span>}
                          />
                        </Renderer>
                      </TableCell>)
                  } else {
                    return Renderer && (
                      <TableCell component='td' scope="row" key={key} align={'right'} >
                        <Renderer {...attributes}>{rowValue}</Renderer>
                      </TableCell>)
                  }

                })}

                {inputState && inputState[uniqueKey] &&
                  <TableCell component='td' scope="row" align={'right'} >
                    <Box component="div" display={inputState[uniqueKey].display}>
                      <TextField
                        InputProps={{
                          'aria-label': 'model name',
                          disableUnderline: true,
                          readOnly: inputState[uniqueKey].readonly
                        }}
                        type="number"
                        name={uniqueKey}
                        value={inputState[uniqueKey].value}
                        style={{ ...inputState[uniqueKey].style, width: '90px' }}
                        classes={{ root: classes.inputStyle }}
                        onChange={(e) => handleInputChange(e)}
                      />
                    </Box>
                  </TableCell>
                }

                {editState && editState[uniqueKey] &&
                  <TableCell component='td' scope="row" key={'action'} align={'right'} >
                    <Button variant="outlined" className={clsx(classes.actionButton)}
                      onClick={() => handleEditClick(uniqueKey)}
                      style={{ ...editState[uniqueKey].style }}
                    >{editState[uniqueKey].value}</Button>

                  </TableCell>
                }
              </TableRow>
            )
          })}
        </TableBody>
        {options.displayPagination &&
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, { label: 'All', value: -1 }]}
                colSpan={paginationColspan}
                count={data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        }
      </Table>
    </TableContainer>
  );
}


export default function TableComponent({ headers, data, actions, options, callback, initialState }) {

  actions = actions ? actions : [];
  headers = headers ? headers : [];
  data = data ? data : [];

  const defaultOptions = {
    displayPagination: true,
    rowsPerPage: 5,
    dataStatus: 'SUCCESS',
    rowSelect: false
  }
  options = options ? { ...defaultOptions, ...options } : defaultOptions;

  if (!options.displayPagination) {
    options = { ...options, rowsPerPage: data.length }
  }

  const tableProps = { headers, data, actions, options, initialState };

  if (!data || !data.length || options.dataStatus === 'PENDING') {
    return <LinearProgressBar />
  } else {
    return <RenderTableComponent tableProps={tableProps} callback={callback} />
  }
}