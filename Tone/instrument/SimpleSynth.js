define(["Tone/core/Tone", "Tone/component/AmplitudeEnvelope", "Tone/source/OmniOscillator", "Tone/signal/Signal", "Tone/instrument/Monophonic"], 
function(Tone){

	"use strict";

	/**
	 *  @class  the SimpleSynth is a single oscillator, monophonic synthesizer
	 *          with an OmniOscillator and an Amplitude Envelope
	 *
	 *  @constructor
	 *  @extends {Tone.Monophonic}
	 *  @param {Object} options the options available for the synth 
	 *                          see defaults below
	 */
	Tone.SimpleSynth = function(options){

		//get the defaults
		options = this.defaultArg(options, Tone.SimpleSynth.defaults);
		Tone.Monophonic.call(this, options);

		/**
		 *  the first oscillator
		 *  @type {Tone.OmniOscillator}
		 */
		this.oscillator = new Tone.OmniOscillator(options.oscillator);

		/**
		 *  the frequency control signal
		 *  @type {Frequency}
		 *  @signal
		 */
		this.frequency = this.oscillator.frequency;

		/**
		 *  the detune control signal
		 *  @type {Cents}
		 *  @signal
		 */
		this.detune = this.oscillator.detune;

		/**
		 *  the amplitude envelope
		 *  @type {Tone.Envelope}
		 */
		this.envelope = new Tone.AmplitudeEnvelope(options.envelope);

		//connect the oscillators to the output
		this.oscillator.chain(this.envelope, this.output);
		//start the oscillators
		this.oscillator.start();
		this._readOnly(["oscillator", "frequency", "detune", "envelope"]);
	};

	Tone.extend(Tone.SimpleSynth, Tone.Monophonic);

	/**
	 *  @const
	 *  @static
	 *  @type {Object}
	 */
	Tone.SimpleSynth.defaults = {
		"oscillator" : {
			"type" : "triangle"
		},
		"envelope" : {
			"attack" : 0.005,
			"decay" : 0.1,
			"sustain" : 0.3,
			"release" : 1
		}
	};

	/**
	 *  start the attack portion of the envelope
	 *  @param {Time} [time=now] the time the attack should start
	 *  @param {number} [velocity=1] the velocity of the note (0-1)
	 *  @returns {Tone.SimpleSynth} `this`
	 */
	Tone.SimpleSynth.prototype.triggerEnvelopeAttack = function(time, velocity){
		//the envelopes
		this.envelope.triggerAttack(time, velocity);
		return this;	
	};

	/**
	 *  start the release portion of the envelope
	 *  @param {Time} [time=now] the time the release should start
	 *  @returns {Tone.SimpleSynth} `this`
	 */
	Tone.SimpleSynth.prototype.triggerEnvelopeRelease = function(time){
		this.envelope.triggerRelease(time);
		return this;
	};


	/**
	 *  clean up
	 *  @returns {Tone.SimpleSynth} `this`
	 */
	Tone.SimpleSynth.prototype.dispose = function(){
		Tone.Monophonic.prototype.dispose.call(this);
		this._writable(["oscillator", "frequency", "detune", "envelope"]);
		this.oscillator.dispose();
		this.oscillator = null;
		this.envelope.dispose();
		this.envelope = null;
		this.frequency = null;
		this.detune = null;
		return this;
	};

	return Tone.SimpleSynth;
});