package marketplace.sensis.app.spotlight;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SpotlightController {
	@Autowired
	private SpotlightService spotlightService;
	
	@RequestMapping(method = RequestMethod.POST, value = "/spotlight")
	public Spotlight addSpotlight(@RequestBody Spotlight spotlight) {
		return spotlightService.addSpotlight(spotlight);
	}
	
	@RequestMapping(method = RequestMethod.POST, value="/spotlights")
	public List<Spotlight> addSpotlights(@RequestBody List<Spotlight> spotlights) {
		return spotlightService.addSpotlights(spotlights);
	}
	
	@RequestMapping("/spotlights")
	public List<Spotlight> getSpotlights() {
		return spotlightService.getSpotlights();
	}
	
	@RequestMapping("/spotlight/{address}/delete")
	public void deleteSpotlightByAddress(@PathVariable String address) {
		spotlightService.deleteSpotlightByAddress(address);
	}
}
