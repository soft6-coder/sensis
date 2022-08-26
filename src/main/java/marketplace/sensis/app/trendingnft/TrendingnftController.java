package marketplace.sensis.app.trendingnft;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TrendingnftController {

	@Autowired
	private TrendingnftService trendingnftService;
	
	@RequestMapping(method = RequestMethod.POST, value = "/trendingnft")
	public Trendingnft addTrendingnft(@RequestBody Trendingnft trendingnft) {
		return trendingnftService.addTrendingnft(trendingnft);
	}
	
	@RequestMapping(method = RequestMethod.POST, value = "/trendingnfts")
	public List<Trendingnft> addTrendingnfts(@RequestBody List<Trendingnft> trendingnfts) {
		return trendingnftService.addTrendingnfts(trendingnfts);
	}
	
	@RequestMapping("/trendingnfts")
	public List<Trendingnft> getTrendingnfts() {
		return trendingnftService.getTrendingnfts();
	}
	
	@RequestMapping("/trendingnft/{address}/delete")
	public void deleteTrendingnftByAddress(@PathVariable String address) {
		trendingnftService.deleteTrendingnftByAddress(address);
	}
}
