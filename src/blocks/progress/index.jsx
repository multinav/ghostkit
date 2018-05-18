// External Dependencies.
import ResizableBox from 're-resizable';
import classnames from 'classnames/dedupe';

// Import CSS
import './style.scss';
import './editor.scss';

// Internal Dependencies.
import elementIcon from '../_icons/progress.svg';

const { __ } = wp.i18n;
const { Component, Fragment } = wp.element;
const {
    RangeControl,
    PanelColor,
    ToggleControl,
} = wp.components;

const {
    InspectorControls,
    ColorPalette,
    RichText,
} = wp.editor;

class ProgressBlock extends Component {
    ghostkitStyles( attributes ) {
        return {
            '.ghostkit-progress-wrap': {
                height: attributes.height,
                borderRadius: attributes.borderRadius,
                backgroundColor: attributes.backgroundColor,
                '.ghostkit-progress-bar': {
                    width: attributes.percent + '%',
                    backgroundColor: attributes.color,
                },
            },
        };
    }

    render() {
        const {
            attributes,
            setAttributes,
            isSelected,
            toggleSelection,
        } = this.props;

        let { className = '' } = this.props;

        const {
            ghostkitClassname,
            caption,
            height,
            percent,
            borderRadius,
            striped,
            color,
            backgroundColor,
        } = attributes;

        // add custom classname.
        if ( ghostkitClassname ) {
            className = classnames( className, ghostkitClassname );
        }

        return (
            <Fragment>
                <InspectorControls>
                    <RangeControl
                        label={ __( 'Height' ) }
                        value={ height || '' }
                        onChange={ ( value ) => setAttributes( { height: value } ) }
                        min={ 5 }
                        max={ 20 }
                    />
                    <RangeControl
                        label={ __( 'Percent' ) }
                        value={ percent || '' }
                        onChange={ ( value ) => setAttributes( { percent: value } ) }
                        min={ 0 }
                        max={ 100 }
                    />
                    <RangeControl
                        label={ __( 'Corner Radius' ) }
                        value={ borderRadius }
                        min="0"
                        max="10"
                        onChange={ ( value ) => setAttributes( { borderRadius: value } ) }
                    />
                    <ToggleControl
                        label={ __( 'Striped' ) }
                        checked={ !! striped }
                        onChange={ ( val ) => setAttributes( { striped: val } ) }
                    />
                    <PanelColor title={ __( 'Color' ) } colorValue={ color } >
                        <ColorPalette
                            value={ color }
                            onChange={ ( value ) => setAttributes( { color: value } ) }
                        />
                    </PanelColor>
                    <PanelColor title={ __( 'Background Color' ) } colorValue={ backgroundColor } >
                        <ColorPalette
                            value={ backgroundColor }
                            onChange={ ( value ) => setAttributes( { backgroundColor: value } ) }
                        />
                    </PanelColor>
                </InspectorControls>
                <div className={ className }>
                    { ( ( caption && caption.length > 0 ) || isSelected ) && (
                        <RichText
                            tagName="small"
                            placeholder={ __( 'Write caption…' ) }
                            value={ caption }
                            onChange={ newCaption => setAttributes( { caption: newCaption } ) }
                        />
                    ) }
                    <ResizableBox
                        className={ classnames( 'ghostkit-progress-wrap', striped ? 'ghostkit-progress-bar-striped' : '' ) }
                        size={ {
                            width: '100%',
                            height,
                        } }
                        minWidth="0%"
                        maxWidth="100%"
                        minHeight="5"
                        maxHeight="20"
                        enable={ { top: false, right: false, bottom: true, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false } }
                        onResizeStart={ () => {
                            toggleSelection( false );
                        } }
                        onResizeStop={ ( event, direction, elt, delta ) => {
                            setAttributes( {
                                height: parseInt( height + delta.height, 10 ),
                            } );
                            toggleSelection( true );
                        } }
                    >
                        <ResizableBox
                            className="ghostkit-progress-bar"
                            size={ {
                                width: `${ percent }%`,
                            } }
                            minWidth="0%"
                            maxWidth="100%"
                            minHeight="100%"
                            maxHeight="100%"
                            enable={ { top: false, right: true, bottom: false, left: false, topRight: false, bottomRight: false, bottomLeft: true, topLeft: false } }
                            onResizeStart={ () => {
                                toggleSelection( false );
                            } }
                            onResizeStop={ ( event, direction, elt, delta ) => {
                                setAttributes( {
                                    percent: Math.min( 100, Math.max( 0, percent + parseInt( 100 * delta.width / jQuery( elt ).parent().width(), 10 ) ) ),
                                } );
                                toggleSelection( true );
                            } }
                        />
                    </ResizableBox>
                </div>
            </Fragment>
        );
    }
}

export const name = 'ghostkit/progress';

export const settings = {
    title: __( 'Progress' ),
    description: __( 'Progress bar.' ),
    icon: <img className="ghostkit-icon" src={ elementIcon } alt="ghostkit-icon" />,
    category: 'common',
    keywords: [
        __( 'progress' ),
        __( 'bar' ),
        __( 'ghostkit' ),
    ],
    supports: {
        html: false,
    },
    attributes: {
        caption: {
            type: 'caption',
        },
        height: {
            type: 'number',
            default: 15,
        },
        percent: {
            type: 'number',
            default: 75,
        },
        borderRadius: {
            type: 'number',
            default: 2,
        },
        striped: {
            type: 'boolean',
            default: true,
        },
        color: {
            type: 'string',
            default: '#008dbe',
        },
        backgroundColor: {
            type: 'string',
            default: '#f3f4f5',
        },
    },

    edit: ProgressBlock,

    save: function( { attributes, className = '' } ) {
        const {
            caption,
            height,
            percent,
            striped,
        } = attributes;

        return (
            <div className={ className }>
                {
                    caption && caption.length && (
                        <small className="ghostkit-progress-caption">{ caption }</small>
                    )
                }
                <div className={ classnames( 'ghostkit-progress-wrap', striped ? 'ghostkit-progress-bar-striped' : '' ) }>
                    <div className="ghostkit-progress-bar" role="progressbar" style={ { width: `${ percent }%`, height: `${ height }px` } } aria-valuenow={ percent } aria-valuemin="0" aria-valuemax="100" />
                </div>
            </div>
        );
    },
};
