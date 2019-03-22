import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as yup from 'yup';
import generate from './lib/generate';

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            code : 'Hi, you might need to upgrade your browser.',
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    get validationSchema() {
        return yup.object().shape({
            StockWidth : yup.number().required('Required'),
            StockLength : yup.number().required('Required'),
            StockThickness : yup.number().required('Required'),
            StockRemove : yup.number().required('Required'),
            ToolDiameter : yup.number().required('Required'),
            ToolStepover : yup.number().required('Required'),
            ToolRpm : yup.number().required('Required'),
            ToolIpm : yup.number().required('Required'),
            ToolDoc : yup.number().required('Required'),
        });
    }

    handleSubmit(values, { setSubmitting }) {
        this.setState({
            code : generate(values).join('\n'),
        });
        setSubmitting(false);
    }

    render() {
        const { code } = this.state;

        return (
            <div>
                <h1>Lumber Mill <span role="img" aria-label="Deciduous tree emoji">🌳</span></h1>
                <p>
                    A little utility what for making non-flat rectangles into flat rectangles.
                    Generates G-Code for simple face- and edge-milling operations. Useful for
                    planing and jointing rough sawn wood, or flattening big ol&apos; slabs.
                </p>
                <Formik
                    initialValues={{
                        StockWidth : '6',
                        StockLength : '48',
                        StockThickness : '1',
                        StockRemove : '0.5',
                        ToolDiameter : '2',
                        ToolStepover : '1.8',
                        ToolRpm : '8000',
                        ToolIpm : '200',
                        ToolDoc : '0.125',
                    }}
                    validationSchema={this.validationSchema}
                    onSubmit={this.handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form className="setups">
                            <div className="setup">
                                <h2>Stock Setup</h2>
                                <div className="stock-setup">
                                    <div className="setup-field">
                                        <label htmlFor="StockOperation">Operation</label>
                                        <Field component="select" name="StockOperation" id="StockOperation">
                                            <option>Face / Plane</option>
                                            <option>Edge / Joint</option>
                                        </Field>
                                    </div>
                                    <div className="setup-field"data-unit="in">
                                        <label htmlFor="StockWidth" >Width</label>
                                        <Field type="text" name="StockWidth" id="StockWidth" />
                                        <ErrorMessage name="StockWidth" component="div" className="error" />
                                    </div>
                                    <div className="setup-field" data-unit="in">
                                        <label htmlFor="StockLength">Length</label>
                                        <Field type="text" name="StockLength" id="StockLength" />
                                        <ErrorMessage name="StockLength" component="div"className="error" />
                                    </div>
                                    <div className="setup-field" data-unit="in">
                                        <label htmlFor="StockThickness">Thickness</label>
                                        <Field type="text" name="StockThickness" id="StockThickness" />
                                        <ErrorMessage name="StockThickness" component="div"className="error" />
                                    </div>
                                    <div className="setup-field" data-unit="in">
                                        <label htmlFor="StockRemove">Amount to Remove</label>
                                        <Field type="text" name="StockRemove" id="StockRemove" />
                                        <ErrorMessage name="StockRemove" component="div"className="error" />
                                    </div>
                                </div>
                            </div>
                            <div className="setup">
                                <h2>Tool Setup</h2>
                                <div className="tool-setup">
                                    <div className="setup-field" data-unit="in">
                                        <label htmlFor="ToolDiameter">Diameter</label>
                                        <Field type="text" name="ToolDiameter" id="ToolDiameter" />
                                        <ErrorMessage name="ToolDiameter" component="div"className="error" />
                                    </div>
                                    <div className="setup-field" data-unit="in">
                                        <label htmlFor="ToolStepover">Stepover</label>
                                        <Field type="text" name="ToolStepover" id="ToolStepover" />
                                        <ErrorMessage name="ToolStepover" component="div"className="error" />
                                    </div>
                                    <div className="setup-field" data-unit="rpm">
                                        <label htmlFor="ToolRpm">Spindle Speed</label>
                                        <Field type="text" name="ToolRpm" id="ToolRpm" />
                                        <ErrorMessage name="ToolRpm" component="div"className="error" />
                                    </div>
                                    <div className="setup-field" data-unit="ipm">
                                        <label htmlFor="ToolIpm" data-unit="in">Feedrate</label>
                                        <Field type="text" name="ToolIpm" id="ToolIpm" />
                                        <ErrorMessage name="ToolIpm" component="div"className="error" />
                                    </div>
                                    <div className="setup-field" data-unit="in">
                                        <label htmlFor="ToolDoc">Depth of Cut</label>
                                        <Field type="text" name="ToolDoc" id="ToolDoc" />
                                        <ErrorMessage name="ToolDoc" component="div"className="error" />
                                    </div>
                                </div>
                            </div>

                            <div className="center">
                                <button type="submit" id="setup-complete" disabled={isSubmitting}>Generate gcode</button>
                                <button type="submit" id="save-file" disabled={isSubmitting}>Download file</button>
                            </div>
                        </Form>
                    )}
                </Formik>

                <pre id="gcode"><code className="language-gcode">{code}</code></pre>
            </div>
        );
    }
}
