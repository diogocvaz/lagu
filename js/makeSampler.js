//clear pads
import alienpad from "../samples/_clear_pads/alienpad/*.ogg"
import bond from "../samples/_clear_pads/bond/*.ogg"
import citylight from "../samples/_clear_pads/citylight/*.ogg"
import emotpad from "../samples/_clear_pads/emotpad/*.ogg"
import mysticrift from "../samples/_clear_pads/mysticrift/*.ogg"
import gloria from "../samples/_clear_pads/gloria/*.ogg"
import puro from "../samples/_clear_pads/puro/*.ogg"
import canny from "../samples/_clear_pads/canny/*.ogg"
import discovery from "../samples/_clear_pads/discovery/*.ogg"

//cloudy pads
import bloom from "../samples/_cloudy_pads/bloom/*.ogg"
import pingwoo from "../samples/_cloudy_pads/pingwoo/*.ogg"
import snakeflute from "../samples/_cloudy_pads/snakeflute/*.ogg"
import bubkes from "../samples/_cloudy_pads/bubkes/*.ogg"
import embrace from "../samples/_cloudy_pads/embrace/*.ogg"
import tubechoir from "../samples/_cloudy_pads/tubechoir/*.ogg"
import elfpresence from "../samples/_cloudy_pads/elfpresence/*.ogg"

//heavy pads
import held from "../samples/_heavy_pads/held/*.ogg"
import endeavour from "../samples/_heavy_pads/endeavour/*.ogg"
import rustybells from "../samples/_heavy_pads/rustybells/*.ogg"
import junerush from "../samples/_heavy_pads/junerush/*.ogg"
import descend from "../samples/_heavy_pads/descend/*.ogg"
import hollowed from "../samples/_heavy_pads/hollowed/*.ogg"
import philia from "../samples/_heavy_pads/philia/*.ogg"
import cryptolush from "../samples/_heavy_pads/cryptolush/*.ogg"

//neutral pads
import brokenstring from "../samples/_neutral_pads/brokenstring/*.ogg"
import violin from "../samples/_neutral_pads/violin/*.ogg"
import spiritwash from "../samples/_neutral_pads/spiritwash/*.ogg"
import marimba from "../samples/_neutral_pads/marimba/*.ogg"
import harp from "../samples/_neutral_pads/harp/*.ogg"
import grandpiano from "../samples/_neutral_pads/grandpiano/*.ogg"
import rhodes from "../samples/_neutral_pads/rhodes/*.ogg"

//bass
import deepbass from "../samples/_deepbass/*.ogg"

export var makeSampler = (instrument) => {
    if (instrument == 'grandpiano') {
        return new Tone.Sampler({
            "C4": grandpiano.c4,
            "C5": grandpiano.c5,
            "C6": grandpiano.c6,
        });
    } else if (instrument == 'violin') {
        return new Tone.Sampler({
            "C2": violin.c2,
            "C3": violin.c3,
            "C4": violin.c4
        });
    } else if (instrument == 'deepbass') {
        return new Tone.Sampler({
            "C2": deepbass.c2,
            "G2": deepbass.g2,
            "C3": deepbass.c3
        });
    } else if (instrument == 'alienpad') {
        return new Tone.Sampler({
            "C3": alienpad.c3,
            "C4": alienpad.c4,
            "F4": alienpad.f4
        });
    } else if (instrument == 'emotpad') {
        return new Tone.Sampler({
            "C2": emotpad.c2,
            "C3": emotpad.c3,
            "F3": emotpad.f3
        });
    } else if (instrument == 'pingwoo') {
        return new Tone.Sampler({
            "C2": pingwoo.c2,
            "C3": pingwoo.c3,
            "F3": pingwoo.f3
        });
    } else if (instrument == 'bloom') {
        return new Tone.Sampler({
            "C2": bloom.c2,
            "C3": bloom.c3,
            "C4": bloom.c4
        });
    } else if (instrument == 'citylight') {
        return new Tone.Sampler({
            "c2": citylight.c2,
            "C3": citylight.c3,
            "C4": citylight.c4,
            "C5": citylight.c5
        });
    } else if (instrument == 'brokenstring') {
        return new Tone.Sampler({
            "C2": brokenstring.c2,
            "C3": brokenstring.c3,
            "C4": brokenstring.c4
        });
    } else if (instrument == 'bond') {
        return new Tone.Sampler({
            "C2": bond.c2,
            "C3": bond.c3,
            "C4": bond.c4
        });
    } else if (instrument == 'held') {
        return new Tone.Sampler({
            "C1": held.c1,
            "C2": held.c2,
            "C3": held.c3
        });
    } else if (instrument == 'mysticrift') {
        return new Tone.Sampler({
            "C1": mysticrift.c1,
            "C2": mysticrift.c2,
            "C3": mysticrift.c3
        });
    } else if (instrument == 'philia') {
        return new Tone.Sampler({
            "C2": philia.c2,
            "C3": philia.c3,
            "C4": philia.c4
        });
    } else if (instrument == 'snakeflute') {
        return new Tone.Sampler({
            "C2": snakeflute.c2,
            "C3": snakeflute.c3,
            "C4": snakeflute.c4
        });
    } else if (instrument == 'spiritwash') {
        return new Tone.Sampler({
            "C2": spiritwash.c2,
            "C3": spiritwash.c3,
            "C4": spiritwash.c4
        });
    } else if (instrument == 'gloria') {
        return new Tone.Sampler({
            "C2": gloria.c2,
            "C3": gloria.c3,
            "C4": gloria.c4
        });
    } else if (instrument == 'endeavour') {
        return new Tone.Sampler({
            "C2": endeavour.c2,
            "C3": endeavour.c3,
            "C4": endeavour.c4
        });
    } else if (instrument == 'rustybells') {
        return new Tone.Sampler({
            "C1": rustybells.c1,
            "C2": rustybells.c2,
            "C3": rustybells.c3
        });
    } else if (instrument == 'marimba') {
        return new Tone.Sampler({
            "C2": marimba.c2,
            "C3": marimba.c3,
            "C4": marimba.c4
        });
    } else if (instrument == 'harp') {
        return new Tone.Sampler({
            "C3": harp.c3,
            "C4": harp.c4,
            "C5": harp.c5
        });
    } else if (instrument == 'junerush') {
        return new Tone.Sampler({
            "C1": junerush.c1,
            "C2": junerush.c2,
            "C3": junerush.c3
        });
    } else if (instrument == 'descend') {
        return new Tone.Sampler({
            "C2": descend.c2,
            "C3": descend.c3,
            "C4": descend.c4
        });
    } else if (instrument == 'hollowed') {
        return new Tone.Sampler({
            "C1": hollowed.c1,
            "C2": hollowed.c2,
            "C3": hollowed.c3
        });
    } else if (instrument == 'bubkes') {
        return new Tone.Sampler({
            "C1": bubkes.c1,
            "C2": bubkes.c2,
            "C3": bubkes.c3
        });
    } else if (instrument == 'embrace') {
        return new Tone.Sampler({
            "C2": embrace.c2,
            "C3": embrace.c3,
            "C4": embrace.c4
        });
    } else if (instrument == 'tubechoir') {
        return new Tone.Sampler({
            "C2": tubechoir.c2,
            "C3": tubechoir.c3,
            "C4": tubechoir.c4,
            "C5": tubechoir.c5
        });
    } else if (instrument == 'elfpresence') {
        return new Tone.Sampler({
            "C1": elfpresence.c1,
            "C2": elfpresence.c2,
            "C3": elfpresence.c3
        });
    } else if (instrument == 'puro') {
        return new Tone.Sampler({
            "C4": puro.c4,
            "C5": puro.c5,
            "C6": puro.c6
        });
    } else if (instrument == 'canny') {
        return new Tone.Sampler({
            "C2": canny.c2,
            "C3": canny.c3,
            "C4": canny.c4
        });
    } else if (instrument == 'discovery') {
        return new Tone.Sampler({
            "C2": discovery.c2,
            "C3": discovery.c3,
            "C4": discovery.c4,
            "C5": discovery.c5
        });
    } else if (instrument == 'cryptolush') {
        return new Tone.Sampler({
            "C2": cryptolush.c2,
            "C3": cryptolush.c3,
            "C4": cryptolush.c4
        });
    } else if (instrument == 'rhodes') {
        return new Tone.Sampler({
            "C1": rhodes.c1,
            "C2": rhodes.c2,
            "C3": rhodes.c3,
            "C4": rhodes.c4
        });
    } 
}