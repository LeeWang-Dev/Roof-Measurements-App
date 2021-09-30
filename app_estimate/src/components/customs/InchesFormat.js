import React from 'react';
import PropTypes from 'prop-types';
import BigNumber from "bignumber.js";
import TextField from '@material-ui/core/TextField';
function InchesFormat(props) {
    const { onChange, ...other } = props;

    const handleFormatInches = (e) => {
        const inputValue = e.target.value;
        const lastChar = inputValue.charAt(e.target.selectionEnd - 1);
        const key = lastChar.charCodeAt(0);
        let exportValue = null;
        if (key === 47 && inputValue.indexOf('/') > 0 && (inputValue.match(/\//g) || []).length === 1 && inputValue.charAt(e.target.selectionEnd - 2) !== '″' && inputValue.charAt(e.target.selectionEnd - 2) !== '-' && inputValue.indexOf('.') < 0) {
           exportValue = inputValue;
        } else if (key === 46 && inputValue.indexOf('.') > 0 && (inputValue.match(/\./g) || []).length === 1 && inputValue.indexOf('-') < 0 && inputValue.indexOf('/') < 0) {
           exportValue = inputValue;
        } else if (key === 45 && inputValue.indexOf('-') > 0 && (inputValue.match(/-/g) || []).length === 1 && inputValue.charAt(e.target.selectionEnd - 2) !== '″' && inputValue.charAt(e.target.selectionEnd - 2) !== '/' && inputValue.indexOf('/') === -1 && inputValue.indexOf('.') < 0) {
           exportValue = inputValue;
        } else if (key === 34 && inputValue.indexOf('″') > 0 && (inputValue.match(/″/g) || []).length === 1 && inputValue.charAt(e.target.selectionEnd - 2) !== '/' && inputValue.charAt(e.target.selectionEnd - 2) !== '-' && inputValue.indexOf('-') === -1) {
           exportValue = inputValue;
        } else if (key === 34 && inputValue.indexOf('″') > 0 && (inputValue.match(/″/g) || []).length === 1 && inputValue.charAt(e.target.selectionEnd - 2) !== '/' && inputValue.charAt(e.target.selectionEnd - 2) !== '-' && inputValue.indexOf('-') > -1 && inputValue.indexOf('/') > -1) {
           exportValue = inputValue;
        } else if (key < 48 || key > 57) {
           exportValue = inputValue.replace(/.$/, '');
        } else if (inputValue.indexOf(`″`) > -1) {
           exportValue = inputValue.substr(0, inputValue.length - 1);
        }
        return exportValue;
    }

    const handleConvertInches = (e) => {
        const inches = ConvertInchesToDecimals(e.target.value);
        const repre = ConvertDecimalToInchesRepresentation(inches);
        return repre;
    }

    return (
      <TextField {...other}
            InputLabelProps={{shrink: true}}
            variant="outlined"
            placeholder="Inches"
            fullWidth
            autoComplete="off"
            onFocus={(e)=>e.target.select()}
            onChange={(e) => onChange({
                target: {
                    name: props.name,
                    value: handleFormatInches(e),
                }
            })}
            onBlur={(e) =>onChange({
                target: {
                    name: props.name,
                    value: handleConvertInches(e),
                }
            })}
      />
    );
  }
  
 export function ConvertInchesToDecimals(e) {
    if (e === "" && e === null) {
       return '0';
    }
    if (checkIfStringIsNumber(e?.replace(`″`, ''))) {
        return BigNumbern(e?.replace(`″`, '')).toString();
    } else {
        const value = e;
        let inches;
        let inchesFraction;
        if ((value.indexOf('-') === -1 || value.indexOf('-') > -1) && value.indexOf('/') === -1) {
            inches = value.match(/^\d*/g)?.join('');
            inchesFraction = value.match(/\d{1,100}\/\d{1,100}/g)?.join('');
        } else if (value.indexOf('-') === -1 && value.indexOf('/') > -1) {
            inches = '0';
            inchesFraction = value.match(/\d{1,100}\/\d{1,100}/g)?.join('');
        } else if (value.indexOf('-') > -1 && value.indexOf('/') > -1) {
            inches = value.match(/^\d*/g)?.join('');
            inchesFraction = value.match(/\d{1,100}\/\d{1,100}/g)?.join('');
        }
        if (!inches || inches === null || inches === '') return 0;
        else if (!inchesFraction || inchesFraction === null || inchesFraction === '') inchesFraction = 0;
        const inchesFractionNumber = BigNumbern(eval(inchesFraction)).plus(inches).toString();
        return inchesFractionNumber;
    }
}

export function ConvertDecimalToInchesRepresentation(e) {
    if (e === "" && e === null) {
      return `0″`;
    }
    const inches = e;
    const integer = `${inches}`.match(/^\d*/g)?.join('');
    const decimal = `${inches}`.match(/\.\d*/g)?.join('')?.replace('.', '');
    const valueFractions = ['1/16', '1/8', '3/16', '1/14', '5/16', '3/8', '7/16', '1/2', '9/16', '5/8', '11/16', '3/4', '13/16', '7/8', '15/16'];
    if (decimal) {
        const fractionNew = reduceFraction(BigNumbern(decimal).toNumber(), addZeros(1, decimal.length));
        let exists = false;
        for (const fraction of valueFractions) {
            if (fraction === `${fractionNew[0]}/${fractionNew[1]}`) {
                exists = true;
                break;
            }
        }
        if (integer === '0') {
            if (exists) return `${fractionNew[0]}/${fractionNew[1]}″`;
            else {
                let total;
                try { total = eval(`${fractionNew[0]}/${fractionNew[1]}`); } catch (err) { total = 0; }
                return `${total}″`;
            }
        }
        else {
            if (exists) return `${integer}-${fractionNew[0]}/${fractionNew[1]}″`;
            else {
                let value;
                try { value = eval(`${fractionNew[0]}/${fractionNew[1]}`); } catch (err) { value = 0; }
                const total = Number(integer) + value;
                return `${total}″`;
            }
        }
    } else {
        return (integer) ? `${integer}″` : `0″`;
    }
}

function checkIfStringIsNumber(str) {
    if (typeof str != "string")
        return false;
    return !isNaN(str) &&
        !isNaN(parseFloat(str));
}

function BigNumbern(value) {
    return new BigNumber(value);
}

function reduceFraction(numerator, denominator) {
    let gcd;
    gcd = function gcd(a, b) {
        return b ? gcd(b, a % b) : a;
    };
    gcd = gcd(numerator, denominator);
    return [numerator / gcd, denominator / gcd];
}

function addZeros(number, numberZeros) {
    let char = `${number}`;
    for (let i = 0; i < numberZeros; i++) {
        char = char + '0';
    }
    return Number(char);
}

InchesFormat.propTypes = {
    onChange: PropTypes.func.isRequired,
};

export default InchesFormat;