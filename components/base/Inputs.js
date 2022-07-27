// THIRD PARTY
import Icon from '@/components/base/Icons';
import classNames from 'classnames';
import { useEffect, useState } from 'react';
import Autocomplete from '@material-ui/core/Autocomplete';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from '@material-ui/core/InputBase';
import Spinner from '@/components/base/Spinner'
import Cleave from 'cleave.js/react';
import AdapterDateFns from '@mui/lab/AdapterMoment';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DatePicker from '@mui/lab/DatePicker';
import TextField from '@mui/material/TextField';
import { IconButton } from './Buttons';
import esLocale from 'moment/locale/es';



export default function Input({
	name,
	id = null,
	type = 'text',
	label = null,
	value = '',
	onChange = () => null,
	errors = [],
	iconStart = null,
	iconEnd = null,
	isClearable = false,
	labelHint = null,
	prefix = null,
	sufix = null,
	inputClassName = '',
	options = [],
	image = null,
	checked = null,

	isFakeLabel = false,
	...props
}) {
	const [myValue, setValue] = useState(value);
	const [isChecked, setChecked] = useState(checked);
	const [uniqueId, setUniqueId] = useState(Math.floor(Math.random() * Date.now()));

	useEffect(() => {
		if (type === 'date' || type === 'autocomplete' || type === 'select', type === 'multiselect') setValue(value)
	}, [value])

	useEffect(() => {
		setChecked(checked)
	}, [checked])


	function onTextChange(e) {
		let res = {
			name: name,
			value: e.target.value,
			...e
		}
		returnValue(res)
	}

	function onFileChange(e) {
		let res = {
			name: name,
			value: e.target.files,
			...e
		}
		setValue(e.target.value);
		returnValue(res)
	}

	function onCleaveChange(e) {
		e.target.value = e.target.rawValue;
		let res = {
			name: name,
			value: e.target.rawValue,
			...e
		}
		returnValue(res)
	}

	function onCheckChange(e) {
		let res = {
			name: name,
			value: e.target.value,
			checked: e.target.checked,
			...e
		}
		returnValue(res)
	}

	function onDateChange(e) {
		let res = {
			name: name,
			value: e,
			...e
		}
		setValue(e);
		returnValue(res)
	}

	function onSelectChange(e) {
		let res = {
			name: name,
			value: e.value,
			...e
		}
		returnValue(res)
	}

	function onAutocmpleteChange(e) {
		let res = {
			name: name,
			value: e,
			...e
		}
		returnValue(res)
	}

	function returnValue(res) {
		// if (res.checked !== null) setChecked(res.checked);
		onChange(res);
	}

	let el = <></>;
	let hideLabel = false;

	let classes = classNames(inputClassName);

	let extraProps = { ...props };
	extraProps['id'] = id || name + '_' + uniqueId;
	extraProps['name'] = name;
	extraProps['className'] = 'input__field-input';
	extraProps['ref'] = props.inputRef;
	extraProps['autoComplete'] = props.autoComplete || 'off';
	delete extraProps['inputRef'];
	delete extraProps['image'];

	let myErrors = getInputErrors(errors, name);


	switch (type) {
		case 'textarea':
			el = <textarea {...extraProps} onChange={onTextChange} value={value} />
			break;

		case 'selectSimple':
			el = <select {...extraProps} onChange={onTextChange} >
				{
					props.options && props.options.map((opt, i) => {
						return <option value={opt}>{opt}</option>
					})
				}
			</select>
			break;

		case 'check':
			if (!label) extraProps['className'] = extraProps['className'] + ' m-0';
			el = <>
				<input type="checkbox" {...extraProps} checked={isChecked} value={value} onChange={onCheckChange} />
				<span className="input__check-view"></span>
				{label && <label className="input__check-label" htmlFor={extraProps['id']}>{label}</label>}
			</>
			hideLabel = true;
			break;

		case 'radio':
			extraProps['type'] === null;
			if (!label) extraProps['className'] = extraProps['className'] + ' m-0';
			el = <>
				<input type="radio" {...extraProps} checked={isChecked} value={value} onChange={onCheckChange} />
				<span className="input__check-view"></span>
				{label && <label className="input__check-label" htmlFor={extraProps['id']}>{label}</label>}
			</>
			hideLabel = true;
			break;

		default: case 'text':
			el = <input type={type} {...extraProps} value={value} onChange={onTextChange} />
			break;

		case 'file':
			el = <input type={type} {...extraProps} value={myValue} onChange={onFileChange} />
			break;

		// cleave
		case 'number':
			extraProps['className'] += ' text-right';
			el = <Cleave {...extraProps} value={value}
				onChange={onCleaveChange}
				options={{
					numeral: true,
					numeralThousandsGroupStyle: 'thousand',
					// delimiter: '.',
					numeralPositiveOnly: true,
					stripLeadingZeroes: true,
				}}
			/>
			break;

		// cleave
		case 'money':
			prefix = '$';
			el = <Cleave {...extraProps} value={value}
				onChange={onCleaveChange}
				options={{
					numeral: true,
					numeralThousandsGroupStyle: 'thousand',
					delimiter: ' ',
					// numeralDecimalMark: ',',
					numeralPositiveOnly: true,
					stripLeadingZeroes: true,
				}}
			/>
			break;

		// cleave
		case 'dni':
			el = <Cleave {...extraProps} value={value}
				onChange={onCleaveChange}
				options={{
					numeral: true,
					numeralThousandsGroupStyle: 'thousand',
					delimiter: ' ',
					numeralPositiveOnly: true,
				}}
			/>
			break;

		// MUI
		case 'autocomplete':
			let newIconEnd = iconEnd || 'chevron-down';
			iconEnd = null;
			el = <Autocomplete
				id={extraProps['id']}
				options={options}
				onChange={(event, newValue) => { setValue(newValue); onChange(newValue); }}
				value={myValue}
				noOptionsText='No se encontraron opciones'
				loadingText="Cargando..."
				ListboxProps={{ className: "input__options-list" }}
				clearOnBlur
				{...props.autocompleteProps}

				renderInput={({ inputProps, InputProps }) => {
					inputProps.className = extraProps.className;
					let clearIcon = InputProps.endAdornment?.props.children[0];
					return (
						<div {...InputProps} className="w-full h-full flex items-center">
							{props.autocompleteProps.loading ?
								<div className='absolute right-0 bg-white'>
									<Spinner className="w-4 h-4 z-10" spinnerClassName="w-4 h-4" />
								</div>
								:
								<Icon glyph={newIconEnd} className="input__field-icon --end" />
							}
							<input type="text" {...extraProps} {...inputProps} />
							{clearIcon && <IconButton {...clearIcon.props} glyph={'close'} type='light' size="md" variant='link' className="bg-transparent input__field-icon --end m-0 right-5" />}
						</div>
					)
				}}
			/>
			break;

		// MUI
		case 'select':
			iconEnd = 'chevron-down';
			el = <Select
				value={myValue}
				fullWidth={true}
				onChange={(e) => { setValue(e.target.value); onTextChange(e); }}
				input={<InputBase />}
				inputProps={{ className: extraProps.className }}
			>
				{!options || options.length === 0 && <MenuItem key="0" disabled>No se encontraron opciones</MenuItem>}
				{options.map(opt => {
					if (typeof opt === 'object') {
						return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
					} else {
						return <MenuItem key={opt} value={opt}>{opt}</MenuItem>
					}
				})}
			</Select>
			break;

		// MUI
		case 'multiselect':
			iconEnd = 'chevron-down';
			el = <Select
				value={myValue}
				fullWidth={true}
				multiple
				onChange={(e) => { setValue(e.target.value); onTextChange(e); }}
				input={<InputBase />}
				inputProps={{ className: extraProps.className }}
				renderValue={(selected) => (
					<div className='pills flex flex-nowrap gap-1 overflow-hidden w-full withScroll overflow-x-auto'>
						{selected.map((value, i) => {
							if(props.multiSelectProps){
								let optSelected = options.filter((opt) => props.multiSelectProps.getOptionValue(opt) === value)
								let l = props.multiSelectProps.getOptionLabel(optSelected[0])
								let v = props.multiSelectProps.getOptionValue(optSelected[0])
								if(l)
								return <span span key={v} className="bg-black bg-opacity-10 rounded-full py-1 px-2 text-sm">{l}</span>
							}
							else{
								const label = options.filter((opt) => opt.value === value)[0]?.label;
								return <span span key={value} className="bg-black bg-opacity-10 rounded-full py-1 px-2 text-sm">{label}</span>
							}
							
							
						})}
					</div >
				)
				}
			>
				{!options || options.length === 0 && <MenuItem key="0" disabled>No se encontraron opciones</MenuItem>}
				{
					options.map(opt => {
						if (typeof opt === 'object') {
							if(props.multiSelectProps){
								let label = props.multiSelectProps.getOptionLabel(opt)
								let value = props.multiSelectProps.getOptionValue(opt)
								return <MenuItem key={value} value={value}>{label}</MenuItem>
							}
							else
								return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
						} else {
							return <MenuItem key={opt} value={opt}>{opt}</MenuItem>
						}
					})
				}
			</Select >
			break;


		// MUI
		case 'date':
			// iconEnd = 'calendar';
			el = <LocalizationProvider dateAdapter={AdapterDateFns}>
				<DatePicker
					// mask={'__/__/____'}
					// label="Basic example"
					minDate={props.minDate}
					maxDate={props.maxDate}
					value={myValue || null}
					onChange={(newValue) => onDateChange(newValue)}
					renderInput={({ inputRef, inputProps, InputProps }) => {
						inputProps.className = extraProps.className;
						let iconProps = InputProps.endAdornment && InputProps.endAdornment.props.children.props;
						// console.log(bla);
						return (<>
							<div className="w-full h-full flex items-center">
								<input type="text" {...inputProps} ref={inputRef} />
							</div>
							<IconButton {...iconProps} glyph={'calendar'} type='light' size="md" variant='link' className="bg-transparent input__field-icon --end m-0" />
						</>)
					}}
				/>
			</LocalizationProvider>
			break;
	}

	return (
		<>
			<div className={classNames('input-group', 'clearfix', '--' + type, { '--disabled': props.disabled })}>
				{
					!hideLabel && label &&
					<label htmlFor={extraProps['id']} className="input__label" >
						{label}
						{labelHint && <small className="input__label-hint mx-1">({labelHint})</small>}
					</label>
				}
				{isFakeLabel && <label htmlFor={extraProps['id']} className="input__label opacity-0" >-</label>}
				<div className={classNames("input__field", classes, { '--withError': myErrors.hasError })}>
					{type === 'radio' || type === 'check' ?
						<>
							{el}
						</>
						:
						<>
							{iconStart && <Icon glyph={iconStart} className="input__field-icon --start" />}
							{prefix && <span className="input__field-hint --start">{prefix}</span>}
							{el}
							{sufix && <span className="input__field-hint --end">{sufix}</span>}
							{iconEnd && <Icon glyph={iconEnd} className="input__field-icon --end" />}
						</>
					}
				</div>
				{
					!hideLabel && !label && labelHint &&
					<small className="input__label-hint block my-1">{labelHint}</small>
				}
				{myErrors.errorLables}
			</div>
		</>
	)

}

export function getInputErrors(errors = [], inputName = '') {
	let hasError = false;
	let errorLables = [];
	let errorClasses = '';
	let errorCount = 0;

	if (errors && errors.length > 0) {
		let showErrors = [];
		showErrors = errors.filter(err => err.field === inputName);
		showErrors.map(error => {
			errorCount++;
			errorLables.push(<p className="errorMsg">{error.message}</p>);
		});
		if (errorCount > 0) {
			hasError = true;
		}
	}

	return {
		hasError: hasError,
		errorLables: errorLables,
		errorClasses: errorClasses,
		errorCount: errorCount,
	};
}
